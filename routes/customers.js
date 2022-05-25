const express = require('express');
const _ = require('lodash');
const { validate, Customer } = require('../models/customer');
const asyncMiddleware = require('../middleware/async');
const router = express.Router();

router.use('/', (req, res, next) => {
    console.log('Cutomer API' + req.url + ' @ ' + Date.now());
    next();
});

router.post('/', asyncMiddleware(async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const {name, isGold, phone} = req.body;
    const customer = new Customer({name, isGold, phone});
    await customer.save();

    res.status(200).send(_.pick(customer, ['name', 'isGold']));
}));

module.exports = router;