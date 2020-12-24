const jwt = require("jsonwebtoken");
const User = require("../models/user");

// for verify token
exports.isTokenValid = async (req, res, next) => {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    try {
      const decodedToken = jwt.verify(
        req.token,
        process.env.ACCESS_TOKEN_SECRET
      );
      const user = User.findById(decodedToken.id);
      if (user) next();
      else {
        res.json({ error: "User doesn't exit for this token" });
      }
    } catch (error) {
      res.send({ error: error });
    }
  } else {
    res.send({ error: "Token is not Available" });
  }
};

// to log request info
exports.logRequestInfo = (req, res, next) => {
  const requestHeader = {
    headers: req.headers,
    body: req.body,
    method: req.method,
    url: req.url,
  };
  console.log(requestHeader);
  next();
};
