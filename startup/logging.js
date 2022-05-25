const winston = require('winston');
require('winston-mongodb');
const config = require('config');
require("express-async-error");

module.exports = function () {
  winston.add(new winston.transports.File({ filename: "logfile.log" }));
  winston.add(
    new winston.transports.MongoDB({
      db: config.get("server.db"),
      options: { useUnifiedTopology: true },
    })
  );
  winston.exceptions.handle(
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );

  process.on("unhandledRejection", (ex) => {
    throw ex;
  });
};
