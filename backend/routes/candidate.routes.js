import express from 'express';
import {
  createCandidate,
  getAllCandidates,
  getCandidatesByElection,
  updateCandidate,
  deleteCandidate
} from '../controllers/candidate.controller.js';

const router = express.Router();

// All routes public - Frontend Clerk handles admin access control
router.get('/', getAllCandidates);
router.get('/election/:electionId', getCandidatesByElection);
router.post('/', createCandidate);
router.put('/:id', updateCandidate);
router.delete('/:id', deleteCandidate);

export default router;
