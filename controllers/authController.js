const bcrypt = require('bcryptjs');

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../configuration/config');

function createToken(user) {
  return jwt.sign({ _id: user._id, email: user.email }, config.jwtSecret, {
    expiresIn: 20000000
  });
}

module.exports = {
  registerUser: async (req, res) => {
    const user = new User(req.body);
    if (!user.email || !user.password || !user.name) {
      res.status(400).json({
        error:
          'No ha ingresado los datos correctamente, por favor intente de nuevo.',
      });
      return;
    }
    const exists = await User.findOne({
      $or: [{ email: user.email }, { identification: user.identification }],
    });
    if (exists) {
      res.status(401).json({
        error: {
          message:
            'Ya existe un usuario con el correo/identificacion ingresado.',
          status: 401,
          stack: 'register user function [registerUser]',
        },
      });
      return;
    }
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        user
          .save()
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((err) =>
            res.status(500).json({
              error: {
                message: err.messag,
                status: 500,
                stack: 'save user to mongoDB [registerUser]',
              },
            })
          );
      });
    });
  },

  loginUser: async (req, res) => {
    if (!req.body.email || !req.body.password) {
      return req.status(400).json({
        error: {
          message: 'Bad request'
        }
      });
    }

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return req.status(401).json({
        error: {
          message: 'Correo/contrasena invalidos.' 
        }
      });
    }

    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (result)  return res.status(200).json({
        token: createToken(user),
        user
      });
      else return req.status(401).json({
        error: {
          message: 'Correo/contrasena invalidos.' 
        }
      });
    });
  },

  logoutUser: (req, res) => {
    req.logout();
    return res.status(200).json(null);
  },

  updatePassword: (req, res) => {
    const passwords = req.body;

    if (passwords.password !== passwords.verifyPassword) {
      return res.status(400).json({
        error: {
          message: 'Las contraseñas no son iguales.',
          status: 400,
          stack: 'updatePassword function [updatePassword]',
        },
      });
    }
    const user = new User(req.user);
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(passwords.password, salt, (err, hash) => {
        user.password = hash;
        user
          .save()
          .then(() => {
            res.status(201).json(user);
          })
          .catch((err) =>
            res.status(500).json({
              error: {
                message: err.message,
                status: 500,
                stack: 'save user to mongoDB [updatePassword]',
              },
            })
          );
      });
    });
  },

  resetPassword: async (req, res) => {
    const body = req.body;

    if (body.password !== body.verifyPassword) {
      return res.status(400).json({
        error: {
          message: 'Las contraseñas no son iguales.',
          status: 400,
          stack: 'updatePassword function [updatePassword]',
        },
      });
    }

    const user = await User.findOne({ email: body.email });
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(body.password, salt, (err, hash) => {
        user.password = hash;
        user
          .save()
          .then(() => {
            res.status(201).json({
              message: 'La contraseña se ha recuperado con exito!',
            });
          })
          .catch((err) =>
            res.status(500).json({
              error: {
                message: err.message,
                status: 500,
                stack: 'save user to mongoDB [updatePassword]',
              },
            })
          );
      });
    });
  },

  updateInfo: (req, res) => {
    const { name, email, lastname, identification } = req.body;
    if (!name || !lastname || !identification || !email) {
      return res.status(400).json({
        error: {
          message: 'Parametros incompletos.',
          status: 400,
          stack: 'Fetch user parameters [updateInfo]',
        },
      });
    }
    const user = new User(req.user);
    user = {
      ...user,
      ...req.body,
    };
    user
      .save()
      .then(() => {
        res.status(200).json(user);
      })
      .catch((err) =>
        res.status(500).json({
          error: {
            message: err.message,
            status: 500,
            stack: 'nose',
          },
        })
      );
  },
};
