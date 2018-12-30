const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameModel = require('./games');

// Create a mongoose Schema
const userSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userPassword: { type: String, required: true },
  games: [gameModel.schema]
});

// Export a mongoose model based on the schema
module.exports = mongoose.model('User', userSchema);
