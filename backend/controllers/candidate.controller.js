import Candidate from '../models/Candidate.js';
import Election from '../models/Election.js';

// ============================================
// CREATE NEW CANDIDATE
// ============================================
export const createCandidate = async (req, res) => {
  try {
    const { 
      name, 
      position, 
      electionId, 
      department, 
      year, 
      manifesto, 
      profileImage,
      socialLinks 
    } = req.body;

    console.log('📋 Creating candidate:', { 
      name, 
      position, 
      electionId, 
      department, 
      year,
      manifesto,
      profileImage,
      socialLinks
    });

    // Validation
    if (!name || !position || !electionId) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'Name, position, and election ID are required'
      });
    }

    // Verify election exists
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ 
        error: 'Election not found',
        message: 'The specified election does not exist'
      });
    }

    // Create candidate with all fields
    const candidate = await Candidate.create({
      name: name.trim(),
      position: position.trim(),
      electionId,
      department: department?.trim() || '',
      year: year ? parseInt(year) : null,
      manifesto: manifesto?.trim() || '',
      profileImage: profileImage?.trim() || '/assets/avatars/default.svg',
      socialLinks: {
        linkedin: socialLinks?.linkedin?.trim() || '',
        instagram: socialLinks?.instagram?.trim() || ''
      },
      voteCount: 0
    });

    console.log('✅ Candidate created successfully:', candidate.name);

    res.status(201).json({
      message: 'Candidate created successfully',
      candidate
    });
  } catch (error) {
    console.error('❌ Error creating candidate:', error);
    res.status(500).json({ 
      error: 'Failed to create candidate',
      message: error.message
    });
  }
};

// ============================================
// GET ALL CANDIDATES
// ============================================
export const getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find()
      .populate('electionId', 'title startTime endTime')
      .sort({ createdAt: -1 });

    res.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ 
      error: 'Failed to fetch candidates',
      message: error.message
    });
  }
};

// ============================================
// GET CANDIDATES BY ELECTION
// ============================================
export const getCandidatesByElection = async (req, res) => {
  try {
    const { electionId } = req.params;

    const candidates = await Candidate.find({ electionId })
      .sort({ position: 1, name: 1 });

    res.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ 
      error: 'Failed to fetch candidates',
      message: error.message
    });
  }
};

// ============================================
// UPDATE CANDIDATE
// ============================================
export const updateCandidate = async (req, res) => {
  try {
    const { 
      name, 
      position, 
      department, 
      year, 
      manifesto, 
      profileImage,
      socialLinks 
    } = req.body;

    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({ 
        error: 'Candidate not found'
      });
    }

    // Update fields
    if (name) candidate.name = name.trim();
    if (position) candidate.position = position.trim();
    if (department !== undefined) candidate.department = department.trim();
    if (year !== undefined) candidate.year = year ? parseInt(year) : null;
    if (manifesto !== undefined) candidate.manifesto = manifesto.trim();
    if (profileImage !== undefined) candidate.profileImage = profileImage.trim();
    
    if (socialLinks) {
      if (socialLinks.linkedin !== undefined) {
        candidate.socialLinks.linkedin = socialLinks.linkedin.trim();
      }
      if (socialLinks.instagram !== undefined) {
        candidate.socialLinks.instagram = socialLinks.instagram.trim();
      }
    }

    await candidate.save();

    console.log('✅ Candidate updated:', candidate.name);

    res.json({
      message: 'Candidate updated successfully',
      candidate
    });
  } catch (error) {
    console.error('❌ Error updating candidate:', error);
    res.status(500).json({ 
      error: 'Failed to update candidate',
      message: error.message
    });
  }
};

// ============================================
// DELETE CANDIDATE
// ============================================
export const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({ 
        error: 'Candidate not found'
      });
    }

    await candidate.deleteOne();

    console.log('✅ Candidate deleted:', candidate.name);

    res.json({
      message: 'Candidate deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting candidate:', error);
    res.status(500).json({ 
      error: 'Failed to delete candidate',
      message: error.message
    });
  }
};
