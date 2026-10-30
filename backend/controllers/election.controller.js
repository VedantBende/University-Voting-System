import Election from '../models/Election.js';
import Candidate from '../models/Candidate.js';
import Vote from '../models/Vote.js';

// ============================================
// CREATE NEW ELECTION
// ============================================
export const createElection = async (req, res) => {
  try {
    const { title, description, category, startTime, endTime, positions } = req.body;

    console.log('📋 Creating election:', { title, category, startTime, endTime, positions });

    // Validation
    if (!title || !startTime || !endTime || !positions || positions.length === 0) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'Title, start time, end time, and at least one position are required'
      });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    // Validate time range
    if (end <= start) {
      return res.status(400).json({ 
        error: 'Invalid time range',
        message: 'End time must be after start time'
      });
    }

    // Parse positions - convert to objects with name and description
    let parsedPositions = positions;
    
    // If positions is a string (JSON stringified), parse it
    if (typeof positions === 'string') {
      try {
        parsedPositions = JSON.parse(positions);
      } catch (e) {
        return res.status(400).json({ 
          error: 'Invalid positions format',
          message: 'Positions must be an array'
        });
      }
    }
    
    // Ensure positions are objects with name and description
    if (Array.isArray(parsedPositions)) {
      parsedPositions = parsedPositions.map(p => {
        if (typeof p === 'string') {
          return { name: p, description: '' };
        }
        return {
          name: p.name || '',
          description: p.description || ''
        };
      });
    }

    console.log('✅ Parsed positions:', parsedPositions);

    // Determine status based on start time
    const now = new Date();
    let status = 'upcoming';
    if (now >= start && now <= end) {
      status = 'active';
    } else if (now > end) {
      status = 'ended';
    }

    // Create election with all fields
    const election = await Election.create({
      title,
      description: description || '',
      category: category || '',
      startTime: start,
      endTime: end,
      positions: parsedPositions,
      status,
      resultsRevealed: false,
      eligibleVoters: [],
      totalVotes: 0
    });

    console.log('✅ Election created successfully:', election.title);

    res.status(201).json({
      message: 'Election created successfully',
      election
    });
  } catch (error) {
    console.error('❌ Error creating election:', error);
    res.status(500).json({ 
      error: 'Failed to create election',
      message: error.message
    });
  }
};

// ============================================
// GET ALL ELECTIONS
// ============================================
export const getAllElections = async (req, res) => {
  try {
    const elections = await Election.find()
      .populate('createdBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .lean();

    // Calculate actual vote count for each election
    const electionsWithVotes = await Promise.all(
      elections.map(async (election) => {
        const voteCount = await Vote.countDocuments({ 
          electionId: election._id 
        });
        
        return {
          ...election,
          totalVotes: voteCount
        };
      })
    );

    res.json(electionsWithVotes);
  } catch (error) {
    console.error('Error fetching elections:', error);
    res.status(500).json({ 
      error: 'Failed to fetch elections',
      message: error.message
    });
  }
};

// ============================================
// GET SINGLE ELECTION
// ============================================
export const getElectionById = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id)
      .populate('createdBy', 'firstName lastName email');

    if (!election) {
      return res.status(404).json({ 
        error: 'Election not found',
        message: 'The requested election does not exist'
      });
    }

    res.json(election);
  } catch (error) {
    console.error('Error fetching election:', error);
    res.status(500).json({ 
      error: 'Failed to fetch election',
      message: error.message
    });
  }
};

// ============================================
// UPDATE ELECTION
// ============================================
export const updateElection = async (req, res) => {
  try {
    const { title, description, category, startTime, endTime, positions } = req.body;

    const election = await Election.findById(req.params.id);

    if (!election) {
      return res.status(404).json({ 
        error: 'Election not found'
      });
    }

    // Validate time range if times are being updated
    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);

      if (end <= start) {
        return res.status(400).json({ 
          error: 'Invalid time range',
          message: 'End time must be after start time'
        });
      }
    }

    // Parse positions if provided
    let parsedPositions = null;
    if (positions) {
      if (typeof positions === 'string') {
        try {
          parsedPositions = JSON.parse(positions);
        } catch (e) {
          return res.status(400).json({ 
            error: 'Invalid positions format'
          });
        }
      } else {
        parsedPositions = positions;
      }
      
      if (Array.isArray(parsedPositions)) {
        parsedPositions = parsedPositions.map(p => {
          if (typeof p === 'string') {
            return { name: p, description: '' };
          }
          return {
            name: p.name || '',
            description: p.description || ''
          };
        });
      }
    }

    // Update fields
    if (title) election.title = title;
    if (description !== undefined) election.description = description;
    if (category !== undefined) election.category = category;
    if (startTime) election.startTime = new Date(startTime);
    if (endTime) election.endTime = new Date(endTime);
    if (parsedPositions) election.positions = parsedPositions;

    await election.save();

    console.log('✅ Election updated:', election.title);

    res.json({
      message: 'Election updated successfully',
      election
    });
  } catch (error) {
    console.error('❌ Error updating election:', error);
    res.status(500).json({ 
      error: 'Failed to update election',
      message: error.message
    });
  }
};

// ============================================
// DELETE ELECTION
// ============================================
export const deleteElection = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);

    if (!election) {
      return res.status(404).json({ 
        error: 'Election not found'
      });
    }

    // Delete all candidates for this election
    await Candidate.deleteMany({ electionId: election._id });

    // Delete election
    await election.deleteOne();

    console.log('✅ Election deleted:', election.title);

    res.json({
      message: 'Election and all associated candidates deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting election:', error);
    res.status(500).json({ 
      error: 'Failed to delete election',
      message: error.message
    });
  }
};
