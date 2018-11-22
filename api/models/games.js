const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  gameName: { type: String, required: true },
  gameImage: String
});

module.exports = mongoose.model('Game', gameSchema);