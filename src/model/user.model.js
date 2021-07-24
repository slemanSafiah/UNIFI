const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now(),
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  todos: [todoSchema],
});

const User = mongoose.model("user", userSchema);

module.exports = User;
