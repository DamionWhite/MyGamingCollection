const mongoose = require('mongoose');

// Create a mongoose Schema
const gameSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  gameName: { type: String, required: true },
  gameImage: String
});

exports.schema = gameSchema;

// Export a mongoose model based on the schema
exports.model = mongoose.model('Game', gameSchema);