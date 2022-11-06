const router = require("express").Router();
const { signup, login, logout } = require("../controller/authController");
const { createValidator } = require("../utils/validation/userValidator");
const { loginValidator } = require("../utils/validation/loginValidator");
router.post("/signup", createValidator, signup);
router.post("/login", loginValidator, login);
router.post("/logout", logout);
module.exports = router;
