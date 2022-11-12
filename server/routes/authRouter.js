const router = require("express").Router();
const {
  signup,
  login,
  logout,
  editPhone,
} = require("../controller/authController");
const { signupValidator } = require("../utils/validation/signupValidator");
const { loginValidator } = require("../utils/validation/loginValidator");
router.post("/signup", signupValidator, editPhone, signup);
router.post("/login", loginValidator, login);
router.post("/logout", logout);
module.exports = router;
