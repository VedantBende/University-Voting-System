import mongoose from 'mongoose';

// Position subdocument schema
const positionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  }
}, { _id: true });

const electionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  category: {
    type: String,
    required: false,
    trim: true,
    default: ''
  },
  positions: [positionSchema],  // Array of position objects
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'ended'],
    default: 'upcoming'
  },
  resultsRevealed: {
    type: Boolean,
    default: false
  },
  eligibleVoters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  totalVotes: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
}, {
  timestamps: true
});

// Index for faster queries
electionSchema.index({ startTime: 1, endTime: 1 });
electionSchema.index({ status: 1 });

const Election = mongoose.model('Election', electionSchema);

export default Election;
