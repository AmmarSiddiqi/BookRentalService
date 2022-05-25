const winston = require("winston");

module.exports = function (err, req, res, next) {
    // winston.log('error', err.message, err);
    winston.error(err.message, err);
    //log the excption
    res.status(500).send('Internal Server Error');
};