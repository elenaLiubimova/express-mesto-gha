const jwt = require("jsonwebtoken");
const { unauthorizedError } = require("../utils/constants");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(unauthorizedError)
      .send({ message: "Необходима авторизация" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, "super-strong-secret");
  } catch (err) {
    return res
      .status(unauthorizedError)
      .send({ message: "Необходима авторизация" });
  }

  req.user = payload;

  next();
};
