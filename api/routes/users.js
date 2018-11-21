const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const User = require('../models/users');

router.get('/', (req, res, next) => {
  User.find()
    .select()
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        users: docs.map(doc => {
          return {
            name: doc.name,
            email: doc.email,
            password: doc.password,
            _id: doc._id,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/users/' + doc._id
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

router.post('/', (req, res, next) => {
  const user = new User({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });
  user
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Created user successfully',
        createdUser: {
          name: result.name,
          email: result.email,
          password: result.password,
          _id: result._id,
          request: {
            type: 'GET',
            url: "http://localhost:3000/users/" + result._id
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
});

router.get('/:userId', (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
    .select('name email password _id')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          user: doc,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/users'
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

router.delete('/:userId', (req, res, next) => {
  const id = req.params.userId;
  User.deleteOne({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'User deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/users',
          body: { name: 'String', price: 'Number' }
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
