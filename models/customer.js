const Joi = require("joi");
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 99,
    trim: true,
    required: true,
  },
  isGold: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: Number,
    required: true,
  },
});

const Customer = mongoose.model("Customer", customerSchema);

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(99).required(),
    isGold: Joi.boolean(),
    phone: Joi.number()
  });
  return schema.validate(customer);
}

exports.customerSchema = customerSchema;
exports.Customer = Customer;
exports.validate = validateCustomer;
