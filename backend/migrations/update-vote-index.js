// Run this in MongoDB shell or create a migration script
// backend/migrations/update-vote-index.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const updateVoteIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const votesCollection = db.collection('votes');

    // Drop old index
    try {
      await votesCollection.dropIndex('electionId_1_voterId_1');
      console.log('✅ Old index dropped');
    } catch (err) {
      console.log('Old index does not exist');
    }

    // Create new index
    await votesCollection.createIndex(
      { electionId: 1, voterId: 1, position: 1 },
      { unique: true }
    );
    console.log('✅ New index created');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateVoteIndex();
