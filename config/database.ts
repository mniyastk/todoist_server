import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todoist_clone';

export async function connectDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4 // Use IPv4, skip trying IPv6
    });
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    // Exit process with failure
    process.exit(1);
  }
}

export async function disconnectDatabase() {
  await mongoose.connection.close();
  console.log('MongoDB Disconnected');
}
