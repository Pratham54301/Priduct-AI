import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const MONGO_URI = process.env.MONGO_URI;

const run = async () => {
  if (!MONGO_URI) {
    throw new Error('MONGO_URI is required to seed admin user.');
  }

  await mongoose.connect(MONGO_URI);

  const email = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const plainPassword = String(process.env.ADMIN_PASSWORD || '').trim();
  const displayName = String(process.env.ADMIN_NAME || 'Admin').trim();

  if (!email || !plainPassword) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required in .env to seed admin user.');
  }
  const hashed = await bcrypt.hash(plainPassword, 10);

  const update = {
    fullName: displayName,
    name: displayName,
    email,
    password: hashed,
    role: 'admin',
    membership: 'lifetime',
    isProfileComplete: true,
  };

  const user = await User.findOneAndUpdate(
    { email },
    { $set: update, $setOnInsert: { createdAt: new Date() } },
    { upsert: true, new: true }
  );

  console.log('Admin user ready:', { id: String(user._id), email: user.email, role: user.role });

  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error('Failed to seed admin user:', error.message);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
