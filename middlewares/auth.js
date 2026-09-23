const jwt = require("jsonwebtoken");
const { UnAuthorizedError } = require("../utils/errors/UnAuthorizedError");

const { JWT_SECRET } = require("../utils/config");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer")) {
    return next(new UnAuthorizedError("Authorization required"));
  }

  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnAuthorizedError("Authorization required"));
  }

  req.user = payload;
  return next();
};

module.exports = auth;
