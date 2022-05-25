const mongoose = require("mongoose");
const Joi = require("joi-oid");

const rentalSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  dateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
  },
});

const Rental = mongoose.model("Rental", rentalSchema);

function validateRentals(rental) {
  const schema = Joi.object({
    customer: Joi.objectId().required(),
    book: Joi.objectId().required(),
  });
  return schema.validate(rental);
}

exports.validate = validateRentals;
exports.Rental = Rental;
exports.rentalSchema = rentalSchema;
