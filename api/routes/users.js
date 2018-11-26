const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Require models
const User = require('../models/users');

// Get all users
// 'GET' HOST_NAME/users
router.get('/', (req, res, next) => {
  User.find()
    .select()
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        users: docs.map(doc => {
          return {
            userName: doc.userName,
            userEmail: doc.userEmail,
            userPassword: doc.userPassword,
            _id: doc._id,
            request: {
              type: 'GET',
              url: process.env.HOST_NAME + '/users/' + doc._id
            }
          }
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).json({
        error: err.message
      });
    });
});

// Create a new User
// 'POST' HOST_NAME/users/signup
router.post('/signup', (req, res, next) => {
  User.find({ userEmail: String(req.body.userEmail).toLowerCase() })
    .exec()
    .then(user => {
      console.log(user);

      //  Does a user with this email exist?
      if (user.length >= 1) {
        // return error because user with email already exists
        return res.status(409).json({
          message: "Mail exists"
        });
      } else {
        //  Email isn't taken, so create user
        bcrypt.hash(req.body.userPassword, 10, (err, hash) => {
          if (err) {
            //  Password couldn't be hashed
            return res.status(500).json({
              message: "Hashing password failed",
              error: err
            });
          }
          else {
            //  Password successfully hashed
            const user = new User({
              _id: mongoose.Types.ObjectId(),
              userName: String(req.body.userName).toLowerCase(),
              userEmail: String(req.body.userEmail).toLowerCase(),
              userPassword: hash
            });

            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: 'Created user successfully',
                  createdUser: {
                    userName: result.userName,
                    userEmail: result.userEmail,
                    userPassword: result.userPassword,
                    _id: result._id,
                    request: {
                      type: 'GET',
                      url: process.env.HOST_NAME + '/users/' + result._id
                    }
                  }
                });
              })
              .catch(err => {
                console.log(err.message);
                res.status(500).json({
                  error: err.message
                });
              })
          }
        })
      }
    })
    .catch()
});

// Login a user
// 'POST' HOST_NAME/users/login
router.post('/login', (req, res, next) => {
  User.find({ userEmail: String(req.body.userEmail).toLowerCase() })
    .exec()
    .then(user => {
      //  No users found with that email
      if (user.length < 1) {
        return res.status(401).json({
          message: 'Auth failed'
        });
      }

      bcrypt.compare(req.body.userPassword, user[0].userPassword, (err, result) => {
        //  Error occured while comparing
        if (err) {
          return res.status(401).json({
            message: 'Auth failed'
          });
        }
        //  Passwords match
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].userEmail,
              userId: user[0]._id
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h"
            }
          );

          return res.status(200).json({
            message: 'Auth successful',
            token: token
          });
        }
        //  Passwords didn't match
        return res.status(401).json({
          message: 'Auth failed'
        });
      });
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).json({
        error: err.message
      });
    });
});

// Get a single user by ID
// 'GET' HOST_NAME/users/:userId
router.get('/:userId', (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
    .select('userName userEmail userPassword _id')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          user: doc,
          request: {
            type: 'GET',
            url: process.env.HOST_NAME + '/users'
          }
        });
      } else {
        res.status(404).json({
          message: "No valid entry found for provided ID"
        });
      }
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).json({ error: err.message });
    });
});

// Delete a single user by ID
// 'DELETE' HOST_NAME/users/:userId
router.delete('/:userId', (req, res, next) => {
  const id = req.params.userId;
  User.deleteOne({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'User deleted',
        request: {
          type: 'POST',
          url: process.env.HOST_NAME + '/users',
          body: { userName: 'String', price: 'Number' }
        }
      });
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).json({
        error: err.message
      });
    });
});

module.exports = router;
