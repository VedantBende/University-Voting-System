import Vote from '../models/Vote.js';
import Election from '../models/Election.js';
import Candidate from '../models/Candidate.js';
import crypto from 'crypto';


// Cast a vote
export const castVote = async (req, res) => {
  try {
    const { electionId, candidateId, position } = req.body;
    const userId = req.user._id;

    console.log('🗳️  Vote attempt:', { userId, electionId, candidateId, position });

    // Validate inputs
    if (!electionId || !candidateId || !position) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'Election ID, candidate ID, and position are required'
      });
    }

    // Check if election exists and is active
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }

    const now = new Date();
    if (now < election.startTime) {
      return res.status(400).json({ 
        error: 'Election not started',
        message: 'This election has not started yet'
      });
    }

    if (now > election.endTime) {
      return res.status(400).json({ 
        error: 'Election ended',
        message: 'This election has ended'
      });
    }

    // Check if candidate exists
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    // Check if user already voted for this position in this election
    const existingVote = await Vote.findOne({
      userId,
      electionId,
      position
    });

    if (existingVote) {
      return res.status(400).json({ 
        error: 'Already voted',
        message: `You have already voted for ${position} in this election`
      });
    }

    // Create vote hash for anonymity
    const voteHash = crypto
      .createHash('sha256')
      .update(`${userId}-${electionId}-${position}-${Date.now()}`)
      .digest('hex');

    // Create vote
    const vote = await Vote.create({
      userId,
      electionId,
      candidateId,
      position,
      voteHash
    });

    console.log('✅ Vote cast successfully');

    res.status(201).json({
      message: 'Vote cast successfully',
      voteHash: vote.voteHash
    });
  } catch (error) {
    console.error('❌ Error casting vote:', error);
    res.status(500).json({ 
      error: 'Failed to cast vote',
      message: error.message
    });
  }
};


// Check user voting status
export const checkUserVotes = async (req, res) => {
  try {
    const { electionId } = req.params;
    const userId = req.user._id;

    console.log('🔍 Checking votes for:', { electionId, userId });

    // Find all votes by this user in this election
    const votes = await Vote.find({
      userId,
      electionId
    });

    // Get positions the user has voted for
    const votedPositions = votes.map(vote => vote.position);

    console.log('✅ Voted positions:', votedPositions);

    res.json({
      hasVoted: votes.length > 0,
      votedPositions
    });
  } catch (error) {
    console.error('❌ Error checking user votes:', error);
    res.status(500).json({ 
      error: 'Failed to check voting status',
      message: error.message
    });
  }
};


// Get election results
export const getElectionResults = async (req, res) => {
  try {
    const { electionId } = req.params;

    console.log('📊 Fetching results for election:', electionId);

    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }

    // Get ALL candidates for this election
    const allCandidates = await Candidate.find({ electionId });
    
    // Get all votes for this election
    const votes = await Vote.find({ electionId });

    console.log('📥 Total candidates:', allCandidates.length);
    console.log('📥 Total votes:', votes.length);

    // Group by position and count votes
    const resultsByPosition = {};

    // First, initialize all candidates with 0 votes
    allCandidates.forEach(candidate => {
      const position = candidate.position;
      
      if (!resultsByPosition[position]) {
        resultsByPosition[position] = {};
      }

      resultsByPosition[position][candidate._id.toString()] = {
        _id: candidate._id,
        name: candidate.name,
        position: candidate.position,
        department: candidate.department,
        year: candidate.year,
        profileImage: candidate.profileImage,
        voteCount: 0
      };
    });

    // Then, count the actual votes
    votes.forEach(vote => {
      const position = vote.position;
      const candidateId = vote.candidateId.toString();

      if (resultsByPosition[position] && resultsByPosition[position][candidateId]) {
        resultsByPosition[position][candidateId].voteCount++;
      }
    });

    // Convert to array format with percentages
    Object.keys(resultsByPosition).forEach(position => {
      const candidates = Object.values(resultsByPosition[position]);
      const totalVotesForPosition = candidates.reduce((sum, c) => sum + c.voteCount, 0);

      // Add percentage and sort by vote count
      resultsByPosition[position] = candidates
        .map(candidate => ({
          ...candidate,
          percentage: totalVotesForPosition > 0 
            ? Math.round((candidate.voteCount / totalVotesForPosition) * 100) 
            : 0
        }))
        .sort((a, b) => b.voteCount - a.voteCount);
    });

    console.log('✅ Results:', JSON.stringify(resultsByPosition, null, 2));

    res.json({
      election: {
        _id: election._id,
        title: election.title,
        description: election.description,
        startTime: election.startTime,
        endTime: election.endTime
      },
      totalVotes: votes.length,
      resultsByPosition
    });
  } catch (error) {
    console.error('❌ Error fetching results:', error);
    res.status(500).json({ 
      error: 'Failed to fetch results',
      message: error.message
    });
  }
};


// Get user's vote history
export const getUserVoteHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify user can only see their own history
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({ 
        error: 'Access denied',
        message: 'You can only view your own voting history'
      });
    }

    const votes = await Vote.find({ userId })
      .populate('electionId', 'title startTime endTime')
      .populate('candidateId', 'name position')
      .sort({ votedAt: -1 });

    const history = votes.map(vote => ({
      _id: vote._id,
      electionId: vote.electionId._id,
      electionTitle: vote.electionId.title,
      position: vote.position,
      votedAt: vote.votedAt,
      voteHash: vote.voteHash
    }));

    res.json({ votes: history });
  } catch (error) {
    console.error('Error fetching vote history:', error);
    res.status(500).json({ 
      error: 'Failed to fetch vote history',
      message: error.message
    });
  }
};
