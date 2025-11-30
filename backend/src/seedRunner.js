const path = require('path');
const { runSqlFile } = require('./db');

async function runSeed() {
  const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');
  const seedPath = path.join(__dirname, '..', '..', 'database', 'seed.sql');

  console.log('Running schema:', schemaPath);
  await runSqlFile(schemaPath);
  console.log('Schema created/ensured.');

  console.log('Running seed:', seedPath);
  await runSqlFile(seedPath);
  console.log('Seed completed.');
}

module.exports = { runSeed };
