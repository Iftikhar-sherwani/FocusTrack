import { createClient } from '@libsql/client';

export const handler = async (event, context) => {
  // CORS Headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  let bodyData;
  try {
    bodyData = JSON.parse(event.body);
  } catch (err) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid JSON payload' }),
    };
  }

  const { name, email } = bodyData;

  if (!name || !email) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Name and email are required' }),
    };
  }

  const db = createClient({
    url: process.env.VITE_TURSO_DATABASE_URL,
    authToken: process.env.VITE_TURSO_AUTH_TOKEN,
  });

  try {
    // Insert into Turso database
    await db.execute({
      sql: 'INSERT INTO users (id, name, email) VALUES (lower(hex(randomblob(16))), ?, ?)',
      args: [name, email],
    });

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ message: 'Signup successful!' }),
    };
  } catch (error) {
    console.error('Error saving user:', error);
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      return {
        statusCode: 409,
        headers,
        body: JSON.stringify({ error: 'Email already registered' }),
      };
    }
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
