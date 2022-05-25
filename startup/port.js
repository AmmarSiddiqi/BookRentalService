const winston = require("winston"); 

module.exports = function (app) {
  const port = 5000;
  const host = "localhost";
  let server = app.listen(port, host, () => {
    winston.info(`Listening on URL: http://${host}:${port}/`);
  });
};
