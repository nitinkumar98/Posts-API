const jwt = require("jsonwebtoken");
exports.isTokenValid = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    try {
      jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET);
      next();
    } catch (error) {
      res.send({ error: error });
    }
  } else {
    res.send({ error: "Token is not Available" });
  }
};

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
