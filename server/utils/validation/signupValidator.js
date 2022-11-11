const { check } = require("express-validator");
const validatorMW = require("../../middleware/validatorMW");
const createError = require("http-errors");
const { prisma } = require("../../controller/prismaClient");
exports.signupValidator = [
  check("firstname")
    .notEmpty()
    .withMessage("firstname is required.")
    .isLength({ min: 3 })
    .withMessage("firstname must be between 3 to 32 characters"),
  check("lastname")
    .notEmpty()
    .withMessage("lastname is required")
    .isLength({ min: 3 })
    .withMessage("lastname must be between 3 to 32 characters"),
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Invalid email"),
  // .custom((val) => {
  //   return prisma.user.findFirst({ where: { email: val } }).then((user) => {
  //     if (user) {
  //       throw new Error("email is exists");
  //     }
  //     return true;
  //   });
  // }),
  check("phone")
    .notEmpty()
    .withMessage("phone is required")
    .isMobilePhone("ar-SY")
    .withMessage("please enter syrian number"),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8, max: 32 })
    .withMessage("password must be between 3 to 32 characters "),
  check("confirmPassword")
    .notEmpty()
    .withMessage("confirm password is required")
    .isLength({ min: 8, max: 32 })
    .withMessage("confirm password must be between 3 to 32 characters ")
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        return Promise.reject(createError(400, "password not confirm"));
      }
      return true;
    }),
  validatorMW,
];
