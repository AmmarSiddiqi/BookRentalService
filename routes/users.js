const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const auth = require("../middleware/auth");
const asyncMiddleware = require('../middleware/async');
const router = express.Router();

router.use(function (req, res, next) {
  console.log("User API" + req.url + " @ " + Date.now());
  next();
});

router.get('/me', auth, 
asyncMiddleware(async (req, res) => {
    const user = await User.findById(req.user._id).select("name email");
    res.send(user);
}));

router.get("/", asyncMiddleware(async (req, res) => {
  const user = await User.find().select("name email");
  res.send(user);
}));

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { username, email, password, isAdmin } = req.body;

  let user = await User.findOne({ email });
  if (user) return res.status(400).send("User already registered");

  user = new User({ username, email, password, isAdmin });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  let token = user.generateAuthToken();
  res
    .header("auth-token", token)
    .status(200)
    .send(_.pick(user, ["username", "email"]));
});

module.exports = router;
