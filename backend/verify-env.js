// Quick script to verify environment variables are loaded correctly
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file
dotenv.config({ path: join(__dirname, '.env') });

console.log('\n=== Environment Variables Verification ===\n');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? `SET (${process.env.GEMINI_API_KEY.substring(0, 7)}...)` : 'NOT SET');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'SET' : 'NOT SET');
console.log('\n=== Verification Complete ===\n');

