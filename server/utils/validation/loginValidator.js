const { check } = require("express-validator");
const validatorMW = require("../../middleware/validatorMW");
const { prisma } = require("../../controller/prismaClient");
const createError = require("http-errors");
const bcrypt = require("bcryptjs");

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("enter a valid email please.")
    .custom((val, { req }) => {
      return prisma.user.findUnique({ where: { email: val } }).then((user) => {
        if (!user) {
          const error = new Error("user with this email not exists");
          throw error;
        }

        if (user) {
          return bcrypt
            .compare(req.body.password, user.password)
            .then((result) => {
              console.log(result);
              if (!result) {
                throw new Error("password incorrect, try again");
              }
            });
        }
        return true;
      });
    }),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password must be between 8 to 32 characters."),
  validatorMW,
];
