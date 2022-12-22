const { Client } = require('pg');

const client = new Client(
  process.env.DATABASE_URL ?? 'postgres://localhost:5432/petpals'
);

// client.connect().then(() => console.log('connected to petpals'));

module.exports = {
  client,
};
