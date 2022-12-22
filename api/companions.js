const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
  createCompanion,
  getCompanions,
  getCompanionById,
  getCompanionByName,
  updateCompanion,
} = require('../db');
const { requireUser } = require('./utils');
const { JWT_SECRET } = process.env;

// GET: /api/companions
router.get('/', requireUser, async (req, res, next) => {
  try {
    res.send(await getCompanions());
  } catch (error) {
    next(error);
  }
});

// POST: /api/companions/login
router.post('/login', async (req, res, next) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      next({
        name: 'Missing Credentials',
        message: 'Please provde both a name and password',
      });
    }

    const user = await getCompanionByName(name);
    const hashedPassword = user.password;
    // console.log(password, hashedPassword);
    const match = await bcrypt.compare(password, hashedPassword);

    if (user && match) {
      // create token & return to user
      delete user.password;
      const token = jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
      // console.log('this is my token: ------> ', token);

      res.send({ message: "You're logged in!", token });
    } else {
      next({
        message: 'Incorrect Credentials',
        name: 'Username or password incorrect',
      });
    }
  } catch (error) {
    next(error);
  }
});

// PATCH: /api/companions/:id
router.patch('/:id', requireUser, async (req, res, next) => {
  try {
    console.log('companion in patch: ', req.companion);
    const { companion } = req;
    const { id } = req.params;

    if (+id !== companion.id) {
      next({
        name: 'Credential Mismatch',
        message: 'You must be the companion of this pet to update.',
      });
    } else {
      const self = await updateCompanion(id, req.body);
      console.log('I am self! ---> ', self);
      res.send(self);
    }
  } catch (error) {
    next(error);
  }
});
module.exports = router;
