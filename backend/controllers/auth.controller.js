import { Clerk } from '@clerk/clerk-sdk-node';
import User from '../models/User.js';

const clerk = new Clerk({
  apiKey: process.env.CLERK_SECRET_KEY
});

const ALLOWED_DOMAIN = process.env.ALLOWED_EMAIL_DOMAIN || 'ghru.edu.in';

const isValidEmail = (email) => {
  return email.toLowerCase().endsWith(`@${ALLOWED_DOMAIN}`);
};

// Check if user exists - THIS IS THE KEY ENDPOINT
export const checkUserExists = async (req, res) => {
  try {
    const { email, clerkId } = req.body;

    console.log('🔍 Checking user existence:', { email, clerkId });

    if (!email && !clerkId) {
      return res.status(400).json({ 
        error: 'Either email or clerkId is required',
        exists: false,
        registered: false
      });
    }

    // Check by clerkId first (most reliable)
    let user = null;
    if (clerkId) {
      user = await User.findOne({ clerkId });
    }
    
    // If not found by clerkId, try email
    if (!user && email) {
      user = await User.findOne({ email: email.toLowerCase() });
    }

    if (user) {
      console.log('✅ User found in database:', user.email);
      return res.status(200).json({
        exists: true,
        registered: true,
        user: {
          id: user._id,
          clerkId: user.clerkId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      });
    }

    // User NOT found - return 404 with clear message
    console.log('❌ User NOT found in database');
    return res.status(404).json({
      exists: false,
      registered: false,
      message: 'User not found in database',
      action: 'signup_required',
      redirectUrl: '/user-not-found'
    });

  } catch (error) {
    console.error('❌ Check user error:', error);
    return res.status(500).json({ 
      error: 'Failed to check user status',
      exists: false,
      registered: false
    });
  }
};

// Sync user - Only for NEW registrations
export const syncUser = async (req, res) => {
  try {
    const { clerkId, email, firstName, lastName } = req.body;

    console.log('📝 Syncing user:', { clerkId, email });

    if (!email || !isValidEmail(email)) {
      return res.status(403).json({ 
        error: `Only @${ALLOWED_DOMAIN} email addresses are allowed`
      });
    }

    let user = await User.findOne({ clerkId });

    if (user) {
      console.log('✅ User already exists, updating');
      user.email = email;
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      await user.save();
    } else {
      console.log('✅ Creating new user');
      user = await User.create({
        clerkId,
        email,
        firstName: firstName || '',
        lastName: lastName || '',
        role: 'student'
      });
    }

    res.status(200).json({
      message: 'User synced successfully',
      user: {
        id: user._id,
        clerkId: user.clerkId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Sync user error:', error);
    res.status(500).json({ error: 'Failed to sync user' });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-__v').lean();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { registrationNumber, department, year } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (registrationNumber !== undefined) user.registrationNumber = registrationNumber;
    if (department !== undefined) user.department = department;
    if (year !== undefined) user.year = year;
    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const getUserByClerkId = async (req, res) => {
  try {
    const { clerkId } = req.params;
    const user = await User.findOne({ clerkId }).select('-__v');
    if (!user) {
      return res.status(404).json({ error: 'User not found', exists: false });
    }
    res.json({ exists: true, user });
  } catch (error) {
    console.error('Get user by Clerk ID error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};
