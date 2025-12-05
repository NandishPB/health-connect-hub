const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('ERROR: DATABASE_URL is not set in .env file');
  console.error('Please create backend/.env with: DATABASE_URL=postgres://user:password@localhost:5432/dbname');
}

const pool = new Pool({ 
  connectionString,
  // Add connection error handling
  connectionTimeoutMillis: 5000,
});

// Handle connection errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Test connection on startup
pool.query('SELECT NOW()')
  .then(() => {
    console.log('✓ Database connected successfully');
  })
  .catch((err) => {
    console.error('✗ Database connection failed:', err.message);
    console.error('\nTo fix this:');
    console.error('1. Install PostgreSQL: sudo apt install postgresql postgresql-contrib');
    console.error('2. Start PostgreSQL: sudo systemctl start postgresql');
    console.error('3. Create database and user (see SETUP.md)');
    console.error('4. Update backend/.env with correct DATABASE_URL');
  });

async function runSqlFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // naive split by ; — keep it simple for seed/schema files
  const statements = content
    .split(/;\s*\n/)
    .map(s => s.trim())
    .filter(Boolean);

  for (const stmt of statements) {
    try {
      await pool.query(stmt);
    } catch (err) {
      // Skip "already exists" errors for types and objects (idempotent operations)
      // 42710 = duplicate_object (type/constraint already exists)
      // 42P07 = duplicate_table (table already exists)
      // These are safe to ignore when running seed multiple times
      if (err.code === '42710' || err.code === '42P07') {
        // Silently skip - object already exists, which is fine
        continue;
      }
      // For other errors, log and throw
      console.error('Failed SQL statement:', stmt.slice(0, 200));
      console.error('Error:', err.message);
      throw err;
    }
  }
}

module.exports = { pool, runSqlFile };
