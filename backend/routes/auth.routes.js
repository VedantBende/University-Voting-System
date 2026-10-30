import express from 'express';
import {
  syncUser,
  getCurrentUser,
  updateUserProfile,
  getUserByClerkId,
  checkUserExists
} from '../controllers/auth.controller.js';
import { requireAuth, verifyUser } from '../middlewares/auth.middleware.js';
import User from '../models/User.js';

const router = express.Router();

// ========== PUBLIC ROUTES ==========

// Check if user exists (by email or Clerk ID)
router.post('/check-user', checkUserExists);

// Sync user with Clerk (called during sign up)
router.post('/sync', syncUser);

// Get user by Clerk ID
router.get('/user/:clerkId', getUserByClerkId);

// ========== PROTECTED ROUTES ==========

// Get current authenticated user
router.get('/me', requireAuth, verifyUser, getCurrentUser);

// Update user profile
router.put('/profile', requireAuth, verifyUser, updateUserProfile);

// ========== ADMIN MANAGEMENT ROUTES ==========

// Make a user admin by email (PUBLIC for development - SECURE THIS IN PRODUCTION)
router.post('/make-admin', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find and update user
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { role: 'admin' },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        message: 'Make sure the user has signed up first'
      });
    }

    console.log('✅ User promoted to admin:', user.email);

    res.json({
      message: '✅ User is now an admin!',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Error making user admin:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// Get all users (for debugging - REMOVE IN PRODUCTION or add auth)
router.get('/users/all', async (req, res) => {
  try {
    const users = await User.find().select('-__v').limit(100);
    res.json({
      count: users.length,
      users: users.map(u => ({
        email: u.email,
        role: u.role,
        name: `${u.firstName} ${u.lastName}`,
        createdAt: u.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user role by email
router.post('/update-role', async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({ error: 'Email and role are required' });
    }

    const validRoles = ['student', 'admin', 'officer'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ 
        error: 'Invalid role',
        validRoles: validRoles
      });
    }

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { role: role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`✅ User role updated: ${user.email} -> ${role}`);

    res.json({
      message: `✅ User role updated to ${role}`,
      user: {
        email: user.email,
        role: user.role,
        name: `${user.firstName} ${user.lastName}`
      }
    });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ error: 'Failed to update role' });
  }
});

export default router;
