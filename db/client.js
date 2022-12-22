const { Client } = require('pg');
const { DATABASE_URL } = process.env;
const connectionString = DATABASE_URL || 'postgres://localhost:5432/petpals';
const client = new Client({
  connectionString,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : undefined,
});

// client.connect().then(() => console.log('connected to petpals'));

module.exports = {
  client,
};
