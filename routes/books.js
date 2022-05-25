const express = require("express");
const asyncMiddleware = require("../middleware/async");
const { Book, validate } = require("../models/book");
const { Author } = require("../models/author");
const _ = require("lodash");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const mongoose = require("mongoose");

const router = express.Router();

router.use(function (req, res, next) {
  console.log("Books API" + req.url + " @ " + Date.now());
  next();
});

router.get("/:id?", asyncMiddleware(async (req, res) => {
    // throw new Error('Something went wrong!');
    if (req.params.id) {
      if(!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).send('Invalid ID');
      const book = await Book.findById({ _id: req.params.id })
        .select("title")
        .populate("author", "name");
      if (!book) return res.status(404).send("Book not found!");
      return res.status(200).send(book);
    }
    const books = await Book.find().populate("author", "name");
    res.status(200).send(books);
  })
);

router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // let exists = await Author.findOne({ _id: req.body.author });
    // if (!exists) return res.status(400).send("Invalid Author ID");

    const { title, author, department, numberOfStock, dailyRentalRate } = req.body;
    let book = new Book({
      title,
      author,
      department,
      numberOfStock,
      dailyRentalRate,
    });
    await book.save();
    res.status(200).send(_.pick(book, ["title", "author", "department"]));
  })
);

router.put(
  "/:id",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let newBook = await Book.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, author: req.body.author },
      { new: true }
    );
    if (!newBook) return res.status(400).send(`ID ${req.params.id} is invalid`);
    res.status(200).send(newBook);
  })
);

router.delete(
  "/:id",
  [auth, admin],
  asyncMiddleware(async (req, res) => {
    // const book = await Book.findById({_id: req.params.id});
    const book = await Book.findById({ _id: req.params.id });
    if (!book) return res.status(400).send("Invalid ID");
    await book.deleteOne({ _id: req.params.id });
    res.status(200).send(_.pick(book, ["title", "department"]));
  })
);

module.exports = router;
