const express = require("express");
const books = require("../routes/books");
const authors = require("../routes/authors");
const users = require("../routes/users");
const auth = require("../routes/auth");
const customers = require("../routes/customers");
const rentals = require("../routes/rentals");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/books/", books);
  app.use("/api/authors/", authors);
  app.use("/api/users/", users);
  app.use("/api/auth/", auth);
  app.use("/api/customers/", customers);
  app.use("/api/rentals/", rentals);
  app.use(error);
};
