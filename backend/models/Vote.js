import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
  electionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Election',
    required: true,
    index: true
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  userId: {
    type: String,  // ✅ CHANGED: String instead of ObjectId (Clerk user ID)
    required: true,
    index: true
  },
  position: {
    type: String,
    required: true,
    index: true
  },
  voteHash: {
    type: String,
    required: true
  },
  votedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// IMPORTANT: One vote per position per election
voteSchema.index({ electionId: 1, userId: 1, position: 1 }, {
  unique: true,
  name: 'one_vote_per_position'
});

const Vote = mongoose.model('Vote', voteSchema);

export default Vote;
