const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Require Models
const Game = require('../models/games');

// Get all games
// 'GET' HOST_NAME/games
router.get('/', (req, res, next) => {
  Game.find()
    .select()
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        games: docs.map(doc => {
          return {
            gameName: doc.name,
            gameImage: doc.gameImage,
            _id: doc._id,
            request: {
              type: 'GET',
              url: process.env.HOST_NAME + '/games/' + doc._id
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

// Create a new game
// 'POST' HOST_NAME/games
router.post('/', (req, res, next) => {
  const game = new Game({
    _id: mongoose.Types.ObjectId(),
    gameName: req.body.gameName,
    gameImage: req.body.gameImage
  });
  game
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Created game successfully',
        createdGame: {
          gameName: result.gameName,
          gameImage: result.gameImage,
          _id: result._id,
          request: {
            type: 'GET',
            url: process.env.HOST_NAME + '/games/' + result._id
          }
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

// Get a single game by ID
// 'GET' HOST_NAME/games/:gameId
router.get('/:gameId', (req, res, next) => {
  const id = req.params.gameId;
  Game.findById(id)
    .select('gameName _id')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          game: doc,
          request: {
            type: 'GET',
            url: process.env.HOST_NAME + '/games'
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

// Update a single game by ID
// 'PATCH' HOST_NAME/games/:gameId
router.patch('/:gameId', (req, res, next) => {
  const id = req.params.gameId;
  Game
    .updateOne(
      { _id: id },
      { $set: { gameName: req.body.gameName } }
    )
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: 'Game updated',
        request: {
          type: 'GET',
          url: process.env.HOST_NAME + '/games/' + id
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

// Delete a single game by ID
// 'DELETE' HOST_NAME/games/:gameId
router.delete('/:gameId', (req, res, next) => {
  const id = req.params.gameId;
  Game.deleteOne({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Game deleted',
        request: {
          type: 'POST',
          url: process.env.HOST_NAME + '/games',
          body: { gameName: 'String', price: 'Number' }
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
