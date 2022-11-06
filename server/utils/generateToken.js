const jwt = require("jsonwebtoken");

module.exports = (data) => {
  const token = jwt.sign(data, process.env.SECRET_KEY, {
    expiresIn: process.env.EXP_TOKEN,
  });
  return token;
};
