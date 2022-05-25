const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const asyncMiddleware = require('../middleware/async');
const { User } = require('../models/user');
const router = express.Router();

router.use('/', (req, res, next) => {
    console.log('Auth API ' + req.url + ' @ ' + Date.now());
    next();
})

router.post('/', asyncMiddleware(async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const {email, password} = req.body;
    let user = await User.findOne({email})
    if (!user) return res.status(400).send('Invalid Email or Password');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(200).send('Invalid Email or Password');

    let token = user.generateAuthToken();
    const salt = await bcrypt.genSalt(10);

    res.send(token);
}));

function validate(user) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(1024).required().email(),
        password: Joi.string().min(6).max(255).required()
    });
    return schema.validate(user);
};

module.exports = router;