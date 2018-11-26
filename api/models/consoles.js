const mongoose = require('mongoose');

// Create a mongoose Schema
const consoleSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  consoleName: { type: String, required: true },
  consoleDeveloper: String,
  consoleReleaseDate: Date,
  consoleGeneration: Number
});

// Export a mongoose model based on the schema
module.exports = mongoose.model('Console', consoleSchema);