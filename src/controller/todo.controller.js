const User = require("../model/user.model");
const httpStatus = require("http-status");
const mongoose = require("mongoose");

const todoController = {};

todoController.addTodo = (req, res) => {
  const newTodo = {
    content: req.body.content,
    addedAt: Date.now(),
  };
  User.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(req.user._id) },
    { $push: { todos: newTodo } },
    { new: true }
  )
    .then((user) => {
      user = user.toObject();
      delete user.password;
      return res.status(httpStatus.ACCEPTED).json({
        user,
      });
    })
    .catch((err) => {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        err,
      });
    });
};

todoController.updateTodo = (req, res) => {
  User.findOneAndUpdate(
    {
      _id: mongoose.Types.ObjectId(req.user._id),
      todos: {
        $elemMatch: { _id: mongoose.Types.ObjectId(req.params.id) },
      },
    },
    {
      $set: {
        "todos.$.content": req.body.content,
      },
    },
    {
      new: true,
    }
  )
    .then((user) => {
      return res.status(httpStatus.OK).json({
        message: "todo updated successfully",
      });
    })
    .catch((err) => {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        err,
      });
    });
};

todoController.deleteTodo = (req, res) => {
  User.findOneAndUpdate(
    {
      _id: mongoose.Types.ObjectId(req.user._id),
    },
    {
      $pull: {
        todos: {
          _id: mongoose.Types.ObjectId(req.params.id),
        },
      },
    },
    { new: true }
  )
    .then((user) => {
      user = user.toObject();
      delete user.password;
      return res.status(httpStatus.ACCEPTED).json({
        user,
      });
    })
    .catch((err) => {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        err,
      });
    });
};

todoController.getTodo = (req, res) => {
  User.findOne(
    { _id: mongoose.Types.ObjectId(req.user._id) },
    {
      _id: 0,
      todos: { $elemMatch: { _id: mongoose.Types.ObjectId(req.params.id) } },
    }
  )
    .then((user) => {
      return res.status(httpStatus.OK).json({
        todo: user.todos[0],
      });
    })
    .catch((err) => {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        err,
      });
    });
};

module.exports = todoController;
