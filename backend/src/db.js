const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

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
      console.error('Failed SQL statement:', stmt.slice(0, 200), err.message);
      throw err;
    }
  }
}

module.exports = { pool, runSqlFile };
