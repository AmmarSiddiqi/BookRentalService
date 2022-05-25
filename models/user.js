const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    min: 3,
    max: 99,
  },
  email: {
    type: String,
    min: 5,
    max: 256,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    min: 6,
    max: 256,
    required: true,
  },
  isAdmin: { type: Boolean, default: false },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("server.jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().min(3).max(99).required(),
    email: Joi.string().email().min(6).max(256).required(),
    password: new passwordComplexity({
      min: 8,
      max: 25,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 1,
      requirementCount: 4,
    }),
    isAdmin: Joi.boolean(),
  }).min(3);
  return schema.validate(user);
}

exports.User = User;
exports.userSchema = userSchema;
exports.validate = validateUser;
