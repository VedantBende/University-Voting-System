import express from 'express';
import {
  castVote,
  checkUserVotes,  // ✅ Add this import
  getElectionResults,
  getUserVoteHistory
} from '../controllers/vote.controller.js';
import { requireAuth, verifyUser } from '../middlewares/auth.middleware.js';


const router = express.Router();


// Voting requires auth (students must be logged in)
router.post('/', requireAuth, verifyUser, castVote);
router.get('/history/:userId', requireAuth, verifyUser, getUserVoteHistory);

// ✅ NEW ROUTE: Check if user has voted in an election
router.get('/check/:electionId', requireAuth, verifyUser, checkUserVotes);

// Results are public
router.get('/results/:electionId', getElectionResults);


export default router;
