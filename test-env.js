import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, '.env');
console.log('Attempting to load .env from:', envPath);
const result = config({ path: envPath });

if (result.error) {
  console.error('Error loading .env file:', result.error);
} else {
  console.log('All env:', process.env);
  console.log('DATABASE_URL:', process.env.DATABASE_URL);
} 