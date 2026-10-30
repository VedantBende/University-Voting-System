import Election from '../models/Election.js';

// Auto-reveal results after election ends
export const autoRevealResults = async () => {
  try {
    const now = new Date();
    
    const electionsToReveal = await Election.find({
      endTime: { $lte: now },
      resultsRevealed: false,
      status: 'active'
    });

    for (const election of electionsToReveal) {
      election.status = 'ended';
      election.resultsRevealed = true;
      await election.save();
      console.log(`📊 Results revealed for: ${election.title}`);
    }
  } catch (error) {
    console.error('Auto reveal error:', error);
  }
};

// Update election status
export const updateElectionStatus = async () => {
  try {
    const now = new Date();

    // Activate upcoming elections
    const electionsToActivate = await Election.find({
      startTime: { $lte: now },
      endTime: { $gt: now },
      status: 'upcoming'
    });

    for (const election of electionsToActivate) {
      election.status = 'active';
      await election.save();
      console.log(`🗳️  Election activated: ${election.title}`);
    }
  } catch (error) {
    console.error('Update status error:', error);
  }
};
