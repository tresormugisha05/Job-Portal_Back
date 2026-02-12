import mongoose from 'mongoose';

export const createIndexes = async () => {
  try {
    console.log('Creating database indexes...');

    // Skip user email index - already in schema
    await mongoose.connection.collection('users').createIndex({ role: 1 }).catch(() => {});
    await mongoose.connection.collection('users').createIndex({ createdAt: -1 }).catch(() => {});

    // Jobs indexes
    await mongoose.connection.collection('jobs').createIndex({ category: 1 }).catch(() => {});
    await mongoose.connection.collection('jobs').createIndex({ jobType: 1 }).catch(() => {});
    await mongoose.connection.collection('jobs').createIndex({ location: 1 }).catch(() => {});
    await mongoose.connection.collection('jobs').createIndex({ employerId: 1 }).catch(() => {});
    await mongoose.connection.collection('jobs').createIndex({ deadline: 1 }).catch(() => {});
    await mongoose.connection.collection('jobs').createIndex({ isActive: 1 }).catch(() => {});
    await mongoose.connection.collection('jobs').createIndex({ createdAt: -1 }).catch(() => {});
    await mongoose.connection.collection('jobs').createIndex({ views: -1 }).catch(() => {});

    // Applications indexes
    await mongoose.connection.collection('applications').createIndex({ userId: 1 }).catch(() => {});
    await mongoose.connection.collection('applications').createIndex({ jobId: 1 }).catch(() => {});
    await mongoose.connection.collection('applications').createIndex({ employerId: 1 }).catch(() => {});
    await mongoose.connection.collection('applications').createIndex({ status: 1 }).catch(() => {});
    await mongoose.connection.collection('applications').createIndex({ submissionDate: -1 }).catch(() => {});
    await mongoose.connection.collection('applications').createIndex({ userId: 1, jobId: 1 }, { unique: true }).catch(() => {});

    // Employers indexes - skip email to avoid conflicts
    await mongoose.connection.collection('employers').createIndex({ companyName: 1 }).catch(() => {});
    await mongoose.connection.collection('employers').createIndex({ isVerified: 1 }).catch(() => {});
    await mongoose.connection.collection('employers').createIndex({ createdAt: -1 }).catch(() => {});

    // Compound indexes
    await mongoose.connection.collection('jobs').createIndex({ category: 1, jobType: 1 }).catch(() => {});
    await mongoose.connection.collection('jobs').createIndex({ location: 1, category: 1 }).catch(() => {});
    await mongoose.connection.collection('jobs').createIndex({ isActive: 1, deadline: 1 }).catch(() => {});
    await mongoose.connection.collection('applications').createIndex({ employerId: 1, status: 1 }).catch(() => {});

    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
};
