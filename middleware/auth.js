const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const config = require("config");

async function auth(req, res,next) {
  const token = req.header("auth-token");
  // const validPassword = await bcrypt.compare(password, user.password);
  // const validToken = await bcrypt.compare(token, token);
  // if(!validToken) return res.status(400).send('Access Denied! Invalid token provided.');
  if (!token) return res.status(401).send("Access Denied! No token provided.");

  try {
    const decoded = jwt.verify(token, config.get("server.jwtPrivateKey"));
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid Token");
  }
}

module.exports = auth;
