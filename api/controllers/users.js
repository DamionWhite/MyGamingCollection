const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// Require models
const User = require('../models/users');
const Game = require('../models/games').model;

exports.get_all_users = (req, res, next) => {
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
};

exports.create_user = (req, res, next) => {
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
              userPassword: hash,
              userGames: []
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
                    userGames: result.userGames,
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
};

exports.login_user = (req, res, next) => {
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
            token: token,
            user: {
              email: user[0].userEmail,
              name: user[0].userName
            }
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
};

exports.get_user = (req, res, next) => {
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
};

exports.get_user_by_token = (req, res, next) => {
  // decode token to get userId
  const id = jwt.decode(req.body.token).userId;

  // copypaste from 'get_user'
  User.findById(id)
    .select('userName userEmail userPassword _id')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          user: {
            email: user[0].userEmail,
            name: user[0].userName
          },
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
};

exports.delete_user = (req, res, next) => {
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
};

// Games

exports.get_all_games = (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
    .select('games')
    .exec()
    .then(docs => {
      console.log("From database", docs);
      if (docs) {
        const response = {
          count: docs.games.length,
          games: docs.games.map(doc => {
            return {
              gameName: doc.gameName,
              _id: doc._id,
              request: {
                type: 'GET',
                url: process.env.HOST_NAME + '/users/' + id + '/games/' + doc._id
              }
            }
          })
        };
        res.status(200).json(response);
      } else {
        res.status(404).json({
          message: "No valid user found for provided ID"
        });
      }
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).json({ error: err.message });
    });
};

// TODO
exports.find_game = () => { };

// TODO
exports.add_game = (req, res, next) => {
  const userId = req.params.userId;
  const game = new Game({
    _id: mongoose.Types.ObjectId(),
    gameName: req.body.gameName
  });

  User.findById(userId)
    .exec()
    .then(user => {
      user.games.push(game);
      user.save()
        .then(result => {
          res.status(201).json({
            message: 'Game created'
          });
        })
        .catch(err => {
          console.log(err.message);
          res.status(500).json({
            error: err.message
          });
        });
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).json({
        error: err.message
      });
    });
};

// TODO
exports.update_game = () => {

};

// TODO
exports.delete_game = (req, res, next) => {
  const userId = req.params.userId;
  const gameId = mongoose.Types.ObjectId(req.params.gameId);

  User.findById(userId)
    .then(user => {
      // Remove game from user.games
      console.log(gameId);
      user.games.pull(gameId);
      console.log(user.games.toObject())

      user.save()
        .then(result => {
          res.status(200).json({
            message: result
          });
        })
        .catch(err => {
          console.log(err.message);
          res.status(500).json({
            error: err.message
          });
        });
    })
    // User not found
    .catch(err => {
      console.log(err.message);
      res.status(500).json({
        error: err.message
      });
    });
};

// TODO
function getGameId(games, gameName) {
  for (game in games) {
    if (games[game].name === gameName) {
      return games[game]._id;
    }
  }
  // No Game found with 'gameName' as name
  return null;
}