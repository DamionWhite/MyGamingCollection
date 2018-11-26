const mongoose = require('mongoose');

// Create a mongoose Schema
const gameSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  gameName: { type: String, required: true },
  gameImage: String
});

// Export a mongoose model based on the schema
module.exports = mongoose.model('Game', gameSchema);