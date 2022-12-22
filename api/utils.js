// write a function that checks to see if a companion is attached to the request.

const requireUser = (req, res, next) => {
  if (!req.companion) {
    next({ message: 'NOT AUTHORIZED!' });
  } else {
    next();
  }
};

module.exports = {
  requireUser,
};
