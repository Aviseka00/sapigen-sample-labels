import mongoose from 'mongoose';
import User from './models/User.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sapigen_labels';

async function seed() {
  await mongoose.connect(MONGO_URI);
  const username = 'admin';
  const existing = await User.findOne({ username });
  if (existing) {
    console.log('Default user already exists: admin / admin123');
  } else {
    await User.create({
      username: 'admin',
      password: 'admin123',
      displayName: 'Admin',
    });
    console.log('Created default user: admin / admin123');
  }
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
