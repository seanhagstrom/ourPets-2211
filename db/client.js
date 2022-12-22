const { Client } = require('pg');
const { DATABASE_URL } = process.env;
const connectionString = DATABASE_URL || 'postgres://localhost:5432/petpals';
const client = new Client(connectionString);

// client.connect().then(() => console.log('connected to petpals'));

module.exports = {
  client,
};
