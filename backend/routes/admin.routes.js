import express from 'express';
import { requireAuth, verifyUser } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import User from '../models/User.js';

const router = express.Router();

// Delete users with invalid email domains
router.delete('/users/invalid-emails', 
  requireAuth, 
  verifyUser, 
  requireRole(['admin']), 
  async (req, res) => {
    try {
      const allowedDomain = process.env.ALLOWED_EMAIL_DOMAIN || 'ghru.edu.in';
      
      // Find all users NOT ending with allowed domain
      const invalidUsers = await User.find({
        email: { $not: { $regex: `@${allowedDomain}$`, $options: 'i' } }
      });

      if (invalidUsers.length === 0) {
        return res.json({
          message: 'No invalid users found',
          count: 0
        });
      }

      // Delete invalid users
      const result = await User.deleteMany({
        email: { $not: { $regex: `@${allowedDomain}$`, $options: 'i' } }
      });

      res.json({
        message: 'Invalid users deleted successfully',
        count: result.deletedCount,
        deletedUsers: invalidUsers.map(u => ({ email: u.email, clerkId: u.clerkId }))
      });
    } catch (error) {
      console.error('Delete invalid users error:', error);
      res.status(500).json({ error: 'Failed to delete invalid users' });
    }
  }
);

// List users with invalid emails
router.get('/users/invalid-emails', 
  requireAuth, 
  verifyUser, 
  requireRole(['admin']), 
  async (req, res) => {
    try {
      const allowedDomain = process.env.ALLOWED_EMAIL_DOMAIN || 'ghru.edu.in';
      
      const invalidUsers = await User.find({
        email: { $not: { $regex: `@${allowedDomain}$`, $options: 'i' } }
      }).select('email firstName lastName clerkId createdAt');

      res.json({
        count: invalidUsers.length,
        users: invalidUsers
      });
    } catch (error) {
      console.error('List invalid users error:', error);
      res.status(500).json({ error: 'Failed to list invalid users' });
    }
  }
);

export default router;
