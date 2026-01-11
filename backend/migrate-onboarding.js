const mongoose = require('mongoose');
const User = require('./models/User');
const UserDetails = require('./models/UserDetails');

async function migrateOnboardingData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/college-connect');

    console.log('Connected to MongoDB');

    // Find all users with onboarding details
    const userDetails = await UserDetails.find({});

    console.log(`Found ${userDetails.length} users with onboarding details`);

    for (const details of userDetails) {
      try {
        // Update the corresponding user
        const user = await User.findByIdAndUpdate(
          details.userId,
          {
            fullName: details.fullName,
            grNo: details.grNo,
            department: details.department,
            year: details.year,
            collegeEmail: details.collegeEmail,
            isOnboarded: true
          },
          { new: true }
        );

        if (user) {
          console.log(`Migrated onboarding data for user: ${user.username}`);
        } else {
          console.log(`User not found for userId: ${details.userId}`);
        }
      } catch (error) {
        console.error(`Error migrating user ${details.userId}:`, error);
      }
    }

    console.log('Migration completed successfully');

    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
migrateOnboardingData();
