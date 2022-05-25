const Joi = require("joi-oid");
const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 256,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
    // required: true,
  },
  department: {
    type: String,
    trim: true,
    // required: true,
    minlength: 3,
    maxlength: 256,
  },
  numberOfStock: {
    type: Number,
    min: 0,
    max: 25,
  },
  dailyRentalRate: {
    type: Number,
    // required: true,
    min: 1,
    max: 100,
  },
});

const Book = mongoose.model("Book", bookSchema);

function validateBooks(book) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(256),
    author: Joi.objectId(),
    department: Joi.string().min(3).max(256),
    numberOfStock: Joi.number().min(0).max(25),
    dailyRentalRate: Joi.number().min(1).max(100),
  }).min(1);
  return schema.validate(book);
}

exports.bookSchema = bookSchema;
exports.Book = Book;
exports.validate = validateBooks;
