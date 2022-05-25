const express = require("express");
const Fawn = require("fawn");
const _ = require("lodash");
const asyncMiddleware = require('../middleware/async');
const { Book } = require("../models/book");
const { Customer } = require("../models/customer");
const { validate, Rental } = require("../models/rental");
const router = express.Router();

Fawn.init("mongodb://localhost/library");

router.use("/", (req, res, next) => {
  console.log("Rentals API" + req.url + " @ " + Date.now());
  next();
});

router.get("/:id?", asyncMiddleware(async (req, res) => {
  if (req.params.id) {
    const rental = await Rental.findById({ _id: req.params.id })
      .populate("customer", "name")
      .populate("book", "title");
    if (!rental) return res.status(400).send("No rental found with this ID");
    return res.status(200).send(rental);
  }
  const rental = await Rental.find();
  res.status(200).send(rental);
}));

router.post("/", asyncMiddleware(async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = await Customer.findById({ _id: req.body.customer });
  if (!customer) return res.status(400).send("Invalid Customer");
  // console.log(customer);

  let book = await Book.findOne({ _id: req.body.book });
  if (!book) return res.status(400).send("Invalid Book");

  let rental = new Rental({
    customer: {
      _id: customer._id,
    },
    book: {
      _id: book._id,
    },
  });

  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update("books", { _id: book._id }, { $inc: { numberOfStock: -1 } })
      .run();
    res.status(200).send(_.pick(rental, ["customer", "book"]));
  } catch (ex) {
    res.send(ex);
  }
}));

module.exports = router;
