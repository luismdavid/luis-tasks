const passport = require("passport");

function loggedIn(req, res, next) {
  console.log(req.user);
  if (req.user) {
    next();
  } else {
    res.status(401).json({
      error: {
        message: 'Debe estar logeado para realizar esta accion.',
        status: 401,
        stack: 'Logged In Middleware'
      }
    });
  }
}

module.exports = passport.authenticate('jwt', { session: false });
