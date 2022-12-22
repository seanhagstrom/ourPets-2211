require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const { client, getPets } = require('./db');
const app = express();
const api = require('./api');

client.connect();
app.use(morgan('dev'));
app.use(express.json());

// app.use((req, res, next) => {
//   console.log('<____Body Logger START____>');
//   console.log(req.body);
//   console.log('<_____Body Logger END_____>');

//   next();
// });

app.get('/', (req, res) => {
  res.send('Hello World from app.js!');
});

app.use('/api', api);

// Default error handler to handle anything that isn't 404;
app.use((error, req, res, next) => {
  console.error(error);
  res.send(error);
});

// catch all 404 error handler
app.get('*', (req, res) => {
  res.status(404).send('Oooooops! :/');
});

module.exports = {
  app,
};
