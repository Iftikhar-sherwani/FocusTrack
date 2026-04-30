import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.VITE_TURSO_DATABASE_URL;
const dbAuthToken = process.env.VITE_TURSO_AUTH_TOKEN;

if (!dbUrl || dbUrl === 'file:local.db') {
  console.warn('Warning: Using local SQLite file instead of remote Turso DB.');
}

const db = createClient({
  url: dbUrl || 'file:local.db',
  authToken: dbAuthToken,
});

async function initDB() {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database and users table initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initDB();
