const config = require('config');

module.exports = function() {
    if (!config.get("server.jwtPrivateKey")) {
        throw new Error("FATAL Error! jwtPrivateKey isn't defined");
      }
}