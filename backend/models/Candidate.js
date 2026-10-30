import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
  electionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Election',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: false,
    trim: true,
    default: ''
  },
  year: {
    type: Number,
    required: false,
    min: 1,
    max: 5,
    default: null
  },
  manifesto: {
    type: String,
    default: '',
    trim: true
  },
  profileImage: {
    type: String,
    default: '/assets/avatars/default.svg',
    trim: true
  },
  socialLinks: {
    linkedin: {
      type: String,
      default: '',
      trim: true
    },
    instagram: {
      type: String,
      default: '',
      trim: true
    }
  },
  voteCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Indexes for faster queries
candidateSchema.index({ electionId: 1, position: 1 });
candidateSchema.index({ name: 1 });

const Candidate = mongoose.model('Candidate', candidateSchema);

export default Candidate;
