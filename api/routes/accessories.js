const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Accessory = require('../models/accessories');

router.get('/', (req, res, next) => {
  Accessory.find()
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
  const accessory = new Accessory({
    _id: mongoose.Types.ObjectId(),
    accessoryName: req.body.name,
  });
  accessory
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Handling POST requests to /accessories',
        createdAccessory: result
      });
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).json({
        error: err.message
      });
    })

});

router.get('/:accessoryId', (req, res, next) => {
  const id = req.params.accessoryId;
  Accessory.findById(id)
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

router.patch('/:accessoryId', (req, res, next) => {
  const id = req.params.accessoryId;
  Accessory
    .updateOne(
      { _id: id },
      { $set: { AccessoryName: req.body.newName } }
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

router.delete('/:accessoryId', (req, res, next) => {
  const id = req.params.accessoryId;
  Accessory.deleteOne({ _id: id })
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
