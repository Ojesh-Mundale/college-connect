const mongoose = require('mongoose');
const User = require('./models/User');

async function checkUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/collegeconnect');

    console.log('Connected to MongoDB');

    // Find all users
    const users = await User.find({}).select('username email isOnboarded fullName grNo department year collegeEmail');

    console.log(`Found ${users.length} users:`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.username} (${user.email})`);
      console.log(`   isOnboarded: ${user.isOnboarded}`);
      console.log(`   fullName: ${user.fullName || 'Not set'}`);
      console.log(`   grNo: ${user.grNo || 'Not set'}`);
      console.log(`   department: ${user.department || 'Not set'}`);
      console.log(`   year: ${user.year || 'Not set'}`);
      console.log(`   collegeEmail: ${user.collegeEmail || 'Not set'}`);
      console.log('---');
    });

    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');

  } catch (error) {
    console.error('Error checking users:', error);
    process.exit(1);
  }
}

// Run the check
checkUsers();
