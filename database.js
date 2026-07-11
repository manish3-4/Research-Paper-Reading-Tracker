import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config(
  { path: join(dirname(fileURLToPath(import.meta.url)), '/.env') }
);  
const mongooseURI = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);

const paperSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, default: () => uuidv4() },
  title: { type: String, required: true },
  firstAuthor: { type: String, required: true },
  domain: { type: String, required: true },
  readingStage: { type: String, required: true },
  citationCount: { type: Number, default: 0 },
  impactScore: { type: String, required: true },
  dateAdded: { type: String, required: true },
  createdAt: { type: String, default: () => new Date().toISOString() }
});

const Paper = mongoose.models.Paper || mongoose.model('Paper', paperSchema);

export async function connectDatabase() {
  try {
    await mongoose.connect(mongooseURI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export { Paper };
