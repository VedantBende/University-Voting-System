import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['student', 'admin', 'officer'],
    default: 'student'
  },
  registrationNumber: String,
  department: String,
  year: Number,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound or additional indexes can be added here if needed

// Pre-save hook for logging
userSchema.pre('save', function(next) {
  console.log('💾 Saving user:', this.email);
  next();
});

// Post-save hook for logging
userSchema.post('save', function(doc) {
  console.log('✅ User saved:', doc.email, '- Role:', doc.role);
});

const User = mongoose.model('User', userSchema);

export default User;
