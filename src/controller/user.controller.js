const User = require("../model/user.model");
const hashPassword = require("../utils/user.helper");
const httpStatus = require("http-status");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userController = {};

userController.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        err: err,
      });
    }
    if (user) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "user Already register",
        err: err,
      });
    }
    hashPassword(req.body.password).then((hashedPassword) => {
      req.body.password = hashedPassword;
      User.create(req.body).then((user) => {
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1 days",
        });
        return res.status(httpStatus.CREATED).json({
          message: "user register successfully",
          userId: user._id,
          token,
        });
      });
    });
  });
};

userController.login = (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(httpStatus.NOT_FOUND).json({
          message: "user not found",
        });
      }
      if (bcrypt.compareSync(req.body.password, user.password)) {
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1 days",
        });
        return res.status(httpStatus.OK).json({
          email: user.email,
          userId: user._id,
          token: token,
        });
      } else {
        return res.status(httpStatus.NOT_FOUND).json({
          message: "user not found",
        });
      }
    })
    .catch((err) => {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        err,
      });
    });
};

module.exports = userController;
