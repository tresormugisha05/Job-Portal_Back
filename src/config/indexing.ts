import mongoose from 'mongoose';

export const createIndexes = async () => {
  try {
    console.log('Checking for legacy indexes to clean up...');

    // Drop legacy employer indexes that cause duplicate key errors
    const employerCollection = mongoose.connection.collection('employers');
    const employerIndexes = await employerCollection.indexes();
    const employerIndexNames = employerIndexes.map(idx => idx.name);

    const legacyIndexes = ['EmployerId_1', 'userId_1'];
    for (const name of legacyIndexes) {
      if (employerIndexNames.includes(name)) {
        console.log(`Dropping legacy index: ${name}`);
        await employerCollection.dropIndex(name).catch(err => {
          console.warn(`Failed to drop legacy index ${name}:`, err.message);
        });
      }
    }

    console.log('Creating database indexes...');

    // Skip user email index - already in schema
    await mongoose.connection.collection('users').createIndex({ role: 1 }).catch(() => { });
    await mongoose.connection.collection('users').createIndex({ createdAt: -1 }).catch(() => { });

    // Jobs indexes
    await mongoose.connection.collection('jobs').createIndex({ category: 1 }).catch(() => { });
    await mongoose.connection.collection('jobs').createIndex({ jobType: 1 }).catch(() => { });
    await mongoose.connection.collection('jobs').createIndex({ location: 1 }).catch(() => { });
    await mongoose.connection.collection('jobs').createIndex({ deadline: 1 }).catch(() => { });
    await mongoose.connection.collection('jobs').createIndex({ isActive: 1 }).catch(() => { });
    await mongoose.connection.collection('jobs').createIndex({ createdAt: -1 }).catch(() => { });
    await mongoose.connection.collection('jobs').createIndex({ views: -1 }).catch(() => { });

    // Applications indexes
    await mongoose.connection.collection('applications').createIndex({ userId: 1 }).catch(() => {});
    await mongoose.connection.collection('applications').createIndex({ jobId: 1 }).catch(() => {});
    await mongoose.connection.collection('applications').createIndex({ status: 1 }).catch(() => {});
    await mongoose.connection.collection('applications').createIndex({ submissionDate: -1 }).catch(() => {});
    await mongoose.connection.collection('applications').createIndex({ userId: 1, jobId: 1 }, { unique: true }).catch(() => {});

    // Employers indexes - skip email to avoid conflicts
    await mongoose.connection.collection('employers').createIndex({ companyName: 1 }).catch(() => { });
    await mongoose.connection.collection('employers').createIndex({ isVerified: 1 }).catch(() => { });
    await mongoose.connection.collection('employers').createIndex({ createdAt: -1 }).catch(() => { });

    // Compound indexes
    await mongoose.connection.collection('jobs').createIndex({ category: 1, jobType: 1 }).catch(() => { });
    await mongoose.connection.collection('jobs').createIndex({ location: 1, category: 1 }).catch(() => { });
    await mongoose.connection.collection('jobs').createIndex({ isActive: 1, deadline: 1 }).catch(() => { });
    await mongoose.connection.collection('applications').createIndex({ employerId: 1, status: 1 }).catch(() => { });

    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
};
