import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const migrateEmployers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('Connected to MongoDB');

        // 1. Find all users with role 'EMPLOYER' directly from the collection to avoid schema validation errors
        // distinct roles to see what we have
        const collection = mongoose.connection.collection('users');
        const employerUsers = await collection.find({ role: 'EMPLOYER' }).toArray();

        console.log(`Found ${employerUsers.length} employer users to migrate`);

        for (const user of employerUsers) {
            try {
                console.log(`Migrating user: ${user.email}`);

                // Check if employer profile already exists linked to this user
                // We need to check the 'employers' collection directly as schema might have changed
                const employersCollection = mongoose.connection.collection('employers');
                const existingProfile = await employersCollection.findOne({ userId: user._id });

                if (existingProfile) {
                    console.log(`Found existing employer profile for ${user.email}`);

                    // Update existing profile with auth data
                    await employersCollection.updateOne(
                        { _id: existingProfile._id },
                        {
                            $set: {
                                // name removed
                                email: user.email,
                                password: user.password, // Already hashed
                                phone: user.phone || existingProfile.phone,
                                role: 'EMPLOYER' // Add role field if needed for consistency
                            },
                            $unset: { userId: 1, contactPhone: 1, name: 1 } // Remove userId and legacy fields
                        }
                    );
                    console.log(`Updated employer profile for ${user.email}`);
                } else {
                    console.log(`No existing profile found for ${user.email}, creating new one`);

                    // Create new employer profile
                    await employersCollection.insertOne({
                        // name removed
                        email: user.email,
                        password: user.password,
                        phone: user.phone || 'N/A',
                        companyName: user.name + "'s Company", // Placeholder
                        industry: 'General',
                        companySize: '1-10',
                        description: 'Migrated employer account',
                        location: 'Unknown',
                        // contactPhone removed
                        isVerified: false,
                        isActive: true,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });
                }

                // Remove the user record
                await collection.deleteOne({ _id: user._id });
                console.log(`Deleted user record for ${user.email}`);

            } catch (err) {
                console.error(`Failed to migrate user ${user.email}:`, err);
            }
        }

        console.log('Migration completed');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateEmployers();
