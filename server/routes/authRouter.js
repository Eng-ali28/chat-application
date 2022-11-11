const router = require("express").Router();
const { signup, login, logout } = require("../controller/authController");
const { signupValidator } = require("../utils/validation/signupValidator");
const { loginValidator } = require("../utils/validation/loginValidator");
router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);
router.post("/logout", logout);
module.exports = router;
