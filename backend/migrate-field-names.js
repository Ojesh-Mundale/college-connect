const mongoose = require('mongoose');
const User = require('./models/User');

async function migrateFieldNames() {
  try {
    console.log('🔄 Starting field name migration...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/college-connect', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Find all users with old field names
    const users = await User.find({
      $or: [
        { grNo: { $exists: true, $ne: null } },
        { department: { $exists: true, $ne: null } },
        { collegeEmail: { $exists: true, $ne: null } }
      ]
    });

    console.log(`📊 Found ${users.length} users with old field names`);

    for (const user of users) {
      console.log(`🔄 Migrating user: ${user.username} (${user.email})`);

      // Prepare update data
      const updateData = {
        $set: {},
        $unset: {}
      };

      if (user.grNo) {
        updateData.$set.contactNumber = user.grNo;
        updateData.$unset.grNo = 1;
      }

      if (user.department) {
        updateData.$set.branch = user.department;
        updateData.$unset.department = 1;
      }

      if (user.collegeEmail) {
        updateData.$set.collegeName = user.collegeEmail;
        updateData.$unset.collegeEmail = 1;
      }

      // Update the user
      await User.findByIdAndUpdate(user._id, updateData);

      console.log(`✅ Migrated user: ${user.username}`);
    }

    console.log('🎉 Field name migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

migrateFieldNames();
