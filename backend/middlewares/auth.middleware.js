import { clerkClient } from '@clerk/clerk-sdk-node';
import User from '../models/User.js';

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'No authentication token provided'
      });
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = await clerkClient.verifyToken(token);
      req.clerkUserId = decoded.sub;
      next();
    } catch (verifyError) {
      console.error('Token verification error:', verifyError.message);
      return res.status(401).json({ 
        error: 'Invalid or expired token'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
};

export const verifyUser = async (req, res, next) => {
  try {
    const clerkUserId = req.clerkUserId;
    
    if (!clerkUserId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    let user = await User.findOne({ clerkId: clerkUserId });

    if (!user) {
      const clerkUser = await clerkClient.users.getUser(clerkUserId);
      const role = clerkUser.publicMetadata?.role || 'student';
      
      user = await User.create({
        clerkId: clerkUserId,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
        role: role
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error in verifyUser:', error);
    res.status(500).json({ error: 'User verification failed' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  if (req.user.role !== 'admin' && req.user.role !== 'officer') {
    return res.status(403).json({ 
      error: 'Access denied',
      message: 'Only administrators can access this resource'
    });
  }

  next();
};
