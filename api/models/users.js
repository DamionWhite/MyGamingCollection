const mongoose = require('mongoose');

// Create a mongoose Schema
const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userPassword: { type: String, required: true }
});

// Export a mongoose model based on the schema
module.exports = mongoose.model('User', userSchema);
