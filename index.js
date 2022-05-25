const express = require("express");
const app = express();
const winston = require("winston");

require("./startup/logging")();
require("./startup/route")(app);
require("./startup/db")();
require("./startup/config")();

const port = process.env.PORT || 5000;
const host = "localhost";
const server = app.listen(port, host, () => {
  winston.info(`Listening on URL: http://${host}:${port}/`);
});

module.exports = server;

// process.on('uncaughtException', ex => {
//   winston.error(ex.message, ex);
//   process.exit(1);
// });

// throw new Error("Failure");

//Code for creating a random port
// const port = 0;
// const host = 'localhost'
// const server = app.listen(port, host, () =>{
//     console.log(`Listening on URL: http://${host}:${server.address().port}/`);
// });
// console.log(server);
// const url = `http://${host}:${server.address().port}/`;
// const message = `Server started at URL ${url}`;
// console.log(message);
