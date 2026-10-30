import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const fixVoteIndex = async () => {
  try {
    console.log('🔧 Fixing vote collection index...\n');

    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/university-voting');
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const votesCollection = db.collection('votes');

    // Get current indexes
    console.log('📋 Current indexes:');
    const indexes = await votesCollection.indexes();
    indexes.forEach(index => {
      console.log('  -', JSON.stringify(index.key));
    });
    console.log('');

    // Drop ALL existing unique indexes
    console.log('🗑️  Dropping old indexes...');
    try {
      await votesCollection.dropIndex('electionId_1_voterId_1');
      console.log('✅ Dropped: electionId_1_voterId_1');
    } catch (e) {
      console.log('⚠️  Index electionId_1_voterId_1 does not exist');
    }

    try {
      await votesCollection.dropIndex('electionId_1_voterId_1_position_1');
      console.log('✅ Dropped: electionId_1_voterId_1_position_1');
    } catch (e) {
      console.log('⚠️  Index electionId_1_voterId_1_position_1 does not exist');
    }

    // CLEAR ALL VOTES (to start fresh)
    console.log('\n🗑️  Clearing all votes...');
    const deleteResult = await votesCollection.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.deletedCount} votes\n`);

    // Create new correct index
    console.log('🔨 Creating new index: { electionId: 1, voterId: 1, position: 1 }');
    await votesCollection.createIndex(
      { electionId: 1, voterId: 1, position: 1 },
      { unique: true, name: 'one_vote_per_position' }
    );
    console.log('✅ New index created successfully\n');

    // Verify new indexes
    console.log('📋 Updated indexes:');
    const newIndexes = await votesCollection.indexes();
    newIndexes.forEach(index => {
      console.log('  -', JSON.stringify(index.key), index.unique ? '(unique)' : '');
    });

    console.log('\n✅ Done! You can now vote for multiple positions.\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
};

fixVoteIndex();
