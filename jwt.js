require('dotenv').config();
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;
console.log(process.env);

console.log('my secret from .env: ', JWT_SECRET);
// console.log(jwt);

const SECRET = "please don't do this in real life"; //Never store your secret in a file on a server. It should be a "secret" in your env.

// console.log('this is our secret: ', SECRET);

// var token = jwt.sign({ foo: 'bar' }, 'shhhhh');

const user = {
  name: 'messi',
  claimToFame: 'champion',
  number: 10,
};

// console.log('user: ', user);

const token = jwt.sign(user, SECRET);

// console.log('this is our first token: ', token);

const decodedFromToken = jwt.verify(token, SECRET);

// console.log('decodedFromToken: ', decodedFromToken);
