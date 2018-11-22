const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Game = require('../models/games');

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
              url: 'http://localhost:3000/games/' + doc._id
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
  const game = new Game({
    _id: mongoose.Types.ObjectId(),
    gameName: req.body.name,
    gameImage: req.body.gameImage
  });
  game
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Created game successfully',
        createdGame: {
          gameName: result.name,
          gameImage: result.gameImage,
          _id: result._id,
          request: {
            type: 'GET',
            url: "http://localhost:3000/games/" + result._id
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
            url: 'http://localhost:3000/games'
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

router.patch('/:gameId', (req, res, next) => {
  const id = req.params.gameId;
  Game
    .updateOne(
      { _id: id },
      { $set: { gameName: req.body.newName } }
    )
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: 'Game updated',
        request: {
          type: 'GET',
          url: 'http://localhost:3000/games/' + id
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

router.delete('/:gameId', (req, res, next) => {
  const id = req.params.gameId;
  Game.deleteOne({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Game deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/games',
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
