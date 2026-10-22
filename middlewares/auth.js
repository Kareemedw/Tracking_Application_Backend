const jwt = require("jsonwebtoken");
const { UnAuthorizedError } = require("../utils/errors/UnAuthorizedError");

const { JWT_SECRET } = require("../utils/config");

const auth = (req, res, next) => {
  console.log("Request:", req.method, req.originalUrl);
  console.log("Authorization exists:", Boolean(req.headers.authorization));
  console.log(
    "Bearer format correct:",
    req.headers.authorization?.startsWith("Bearer "),
  );

  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnAuthorizedError("Authorization required"));
  }

  const token = authorization.slice(7);

  if (!token || token === "null" || token === "undefined") {
    return next(new UnAuthorizedError("Authentication token missing"));
  }

  try {
    console.log("JWT sections:", token.split(".").length);
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded.id || !decoded.role) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    req.user = {
      _id: decoded.id,
      role: decoded.role,
    };

    return next();
  } catch (err) {
    return next(new UnAuthorizedError("Authorization required"));
  }
};

module.exports = auth;
