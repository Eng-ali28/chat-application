const { validationResult } = require("express-validator");

const validationResultMW = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array() });
  }
  next();
};

module.exports = validationResultMW;
