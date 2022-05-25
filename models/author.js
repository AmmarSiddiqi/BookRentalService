const Joi = require('joi');
const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 99,
        required: true
    }
});

const Author = mongoose.model('Author', authorSchema);

function validateAuthor(author) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(99).required()
    });
    return schema.validate(author);
};

exports.authorSchema = authorSchema;
exports.Author = Author;
exports.validate = validateAuthor;