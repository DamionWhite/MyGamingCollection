const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const GameConsole = require('../models/consoles');

router.get('/', (req, res, next) => {
  GameConsole.find()
    .exec()
    .then(docs => {
      console.log(docs);
      res.status(200).json(docs);
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).json({
        error: err.message
      });
    });
});

router.post('/', (req, res, next) => {
  const gameConsole = new GameConsole({
    _id: mongoose.Types.ObjectId(),
    consoleName: req.body.name,
  });
  gameConsole
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Handling POST requests to /consoles",
        createdConsole: result
      });
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).json({
        error: err.message
      });
    });
});

router.get('/:consoleId', (req, res, next) => {
  const id = req.params.consoleId;
  GameConsole.findById(id)
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json(doc);
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

router.patch('/:consoleId', (req, res, next) => {
  const id = req.params.consoleId;
  GameConsole
    .updateOne(
      { _id: id },
      { $set: { consoleName: req.body.newName } }
    )
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).json({
        error: err.message
      });
    });
});

router.delete('/:consoleId', (req, res, next) => {
  const id = req.params.consoleId;
  GameConsole.deleteOne({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).json({
        error: err.message
      });
    });
});

module.exports = router;
