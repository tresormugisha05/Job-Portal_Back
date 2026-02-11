import mongoose from 'mongoose';

export const createIndexes = async () => {
  try {
    console.log('Creating database indexes...');

    // Users indexes
    try {
      await mongoose.connection.collection('users').createIndex({ email: 1 }, { unique: true });
    } catch (error) {
      console.error('Error creating unique index on users.email:', error);
    }
    await mongoose.connection.collection('users').createIndex({ role: 1 });
    await mongoose.connection.collection('users').createIndex({ createdAt: -1 });

    // Jobs indexes
    await mongoose.connection.collection('jobs').createIndex({ category: 1 });
    await mongoose.connection.collection('jobs').createIndex({ jobType: 1 });
    await mongoose.connection.collection('jobs').createIndex({ location: 1 });
    await mongoose.connection.collection('jobs').createIndex({ employerId: 1 });
    await mongoose.connection.collection('jobs').createIndex({ deadline: 1 });
    await mongoose.connection.collection('jobs').createIndex({ isActive: 1 });
    await mongoose.connection.collection('jobs').createIndex({ createdAt: -1 });
    await mongoose.connection.collection('jobs').createIndex({ views: -1 });

    // Applications indexes
    await mongoose.connection.collection('applications').createIndex({ userId: 1 });
    await mongoose.connection.collection('applications').createIndex({ jobId: 1 });
    await mongoose.connection.collection('applications').createIndex({ employerId: 1 });
    await mongoose.connection.collection('applications').createIndex({ status: 1 });
    await mongoose.connection.collection('applications').createIndex({ submissionDate: -1 });
    try {
      await mongoose.connection.collection('applications').createIndex({ userId: 1, jobId: 1 }, { unique: true });
    } catch (error) {
      console.error('Error creating unique index on applications.userId, jobId:', error);
    }

    // Employers indexes
    try {
      await mongoose.connection.collection('employers').createIndex({ contactEmail: 1 }, { unique: true });
    } catch (error) {
      console.error('Error creating unique index on employers.contactEmail:', error);
    }
    await mongoose.connection.collection('employers').createIndex({ companyName: 1 });
    await mongoose.connection.collection('employers').createIndex({ isVerified: 1 });
    await mongoose.connection.collection('employers').createIndex({ createdAt: -1 });

    // Compound indexes for common queries
    await mongoose.connection.collection('jobs').createIndex({ category: 1, jobType: 1 });
    await mongoose.connection.collection('jobs').createIndex({ location: 1, category: 1 });
    await mongoose.connection.collection('jobs').createIndex({ isActive: 1, deadline: 1 });
    await mongoose.connection.collection('applications').createIndex({ employerId: 1, status: 1 });

    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
};
