import { Clerk } from '@clerk/clerk-sdk-node';

// Initialize Clerk client
export const clerkClient = new Clerk({
  apiKey: process.env.CLERK_SECRET_KEY
});

// Helper function to verify session token
export const verifySessionToken = async (token) => {
  try {
    const session = await clerkClient.sessions.verifySession(token, token);
    return session;
  } catch (error) {
    console.error('Session verification error:', error);
    return null;
  }
};

// Helper function to get user by ID
export const getClerkUser = async (userId) => {
  try {
    const user = await clerkClient.users.getUser(userId);
    return user;
  } catch (error) {
    console.error('Get Clerk user error:', error);
    return null;
  }
};

export default clerkClient;
