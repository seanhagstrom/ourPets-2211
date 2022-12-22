const { Client } = require('pg');

const client = new Client('postgres://localhost:5432/petpals');

// client.connect().then(() => console.log('connected to petpals'));

module.exports = {
  client,
};
