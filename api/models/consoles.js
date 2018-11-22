const mongoose = require('mongoose');

const consoleSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  consoleName: { type: String, required: true },
  consoleDeveloper: String,
  consoleReleaseDate: Date,
  consoleGeneration: Number
});

module.exports = mongoose.model('Console', consoleSchema);