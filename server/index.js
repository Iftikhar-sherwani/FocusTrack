import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@libsql/client';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize Turso Client
const db = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.VITE_TURSO_AUTH_TOKEN,
});

app.post('/api/signup', async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    // Insert into Turso database
    await db.execute({
      sql: 'INSERT INTO users (id, name, email) VALUES (lower(hex(randomblob(16))), ?, ?)',
      args: [name, email],
    });

    res.status(201).json({ message: 'Signup successful!' });
  } catch (error) {
    console.error('Error saving user:', error);
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve static files from the React app (Production)
app.use(express.static(path.join(__dirname, '../dist')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
