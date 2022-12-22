// const router = require('express').Router();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const { getCompanionById } = require('../db');
/******Authorization Middleware ******/
// bring in jwt
// brin in secret
// getCompanionById

// Authorization middleware verify the jwt is valid and attach the user to the req.
router.use(async (req, res, next) => {
  try {
    // console.log('These are my request header: ', req.headers);
    const auth = req.header('Authorization');
    // console.log('auth is: ', auth);

    if (!auth) {
      next();
    } else {
      // get the token from the auth header
      const [, token] = auth.split(' ');
      // console.log('is this token?', token);
      // verify the jwt is valid
      const companionObj = jwt.verify(token, JWT_SECRET);
      // console.log('this is me', companionObj);

      // attach the user to the req
      const companion = await getCompanionById(companionObj.id);

      req.companion = companion;

      next();
    }
  } catch (error) {
    next(error);
  }
});

// Test to see if companion was added to request.
// router.use(async (req, res, next) => {
//   try {
//     console.log(
//       'Yay, our companion has been added to our request',
//       req.companion
//     );
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

/***sub routers below ***/
const petsRouter = require('./pets');
router.use('/pets', petsRouter);
const companionsRouter = require('./companions');
router.use('/companions', companionsRouter);
const tricksRouter = require('./tricks');
router.use('/tricks', tricksRouter);

module.exports = router;
