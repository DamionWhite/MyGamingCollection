const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const GameConsole = require('../models/consoles');

router.get('/', (req, res, next) => {
  GameConsole.find()
    .select()
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        consoles: docs.map(doc => {
          return {
            consoleName: doc.consoleName,
            consoleDeveloper: doc.consoleDeveloper,
            consoleReleaseDate: doc.consoleReleaseDate,
            consoleGeneration: doc.consoleGeneration,
            _id: doc._id,
            request: {
              type: 'GET',
              url: process.env.HOST_NAME + '/consoles/' + doc._id
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
  const gameConsole = new GameConsole({
    _id: mongoose.Types.ObjectId(),
    consoleName: req.body.name,
    consoleDeveloper: req.body.developer,
    consoleReleaseDate: Date.parse(req.body.releaseDate + ' 01:00:00'),
    consoleGeneration: Number(req.body.generation)
  });
  gameConsole
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Created console successfully',
        createdConsole: {
          consoleName: result.consoleName,
          consoleDeveloper: result.consoleDeveloper,
          consoleReleaseDate: result.consoleReleaseDate,
          consoleGeneration: result.consoleGeneration,
          _id: result._id,
          request: {
            type: 'GET',
            url: process.env.HOST_NAME + '/consoles/' + result._id
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

router.get('/:consoleId', (req, res, next) => {
  const id = req.params.consoleId;
  GameConsole.findById(id)
    .select('consoleName _id')
    .exec()
    .then(doc => {
      console.log('From database', doc);
      if (doc) {
        res.status(200).json({
          console: doc,
          request: {
            type: 'GET',
            url: process.env.HOST_NAME + '/consoles'
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
      res.status(200).json({
        message: 'Console updated',
        request: {
          type: 'GET',
          url: process.env.HOST_NAME + '/consoles/' + id
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

router.delete('/:consoleId', (req, res, next) => {
  const id = req.params.consoleId;
  GameConsole.deleteOne({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Console deleted',
        request: {
          type: 'POST',
          url: process.env.HOST_NAME + '/consoles',
          body: { consoleName: 'String', price: 'Number' }
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
