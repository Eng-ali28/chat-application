const {
  prisma,
  ClientErrorHandling,
  errorHandling,
} = require("./prismaClient");
const modelError = require("../utils/prismaErrorHandling");
const createError = require("http-errors");
const generateToken = require("../utils/generateToken");
const jwt = require("jsonwebtoken");
// ====== start signup section ====
// middleware for crypt password

exports.signup = async (req, res, next) => {
  try {
    const { firstname, lastname, email, password, phone } = req.body;
    const user = await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        phone,
        password,
      },
    });
    const token = generateToken({ userId: user.id, email: user.email });
    res.cookie("token", `bearer ${token}`, { httpOnly: true });
    res.status(201).json({ user });
  } catch (error) {
    console.log(error);
    modelError(next, errorHandling, ClientErrorHandling, "user", error);
  }
};
// ====== end signup section ======

// ====== start login section ====
exports.login = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      next(createError(400, "user with this email not exists"));
    }
    const token = generateToken({ userId: user.id, email: user.email });
    res.cookie("token", `bearer ${token}`, { httpOnly: true });
    res.status(200).json({ user });
  } catch (error) {
    modelError(next, errorHandling, ClientErrorHandling, "user", error);
  }
};
// ====== end login section ======
// ====== start logout section ===
exports.logout = async (req, res, next) => {
  if (!req.cookies.token) {
    return next(createError(400, "you are not logging yet."));
  }
  res.clearCookie("token");
  res.status(204).send();
};
// ====== end logout section =====
// ====== start protect section ==
exports.protect = async (req, res, next) => {
  // check if token exists
  if (!req.cookies.token) {
    return next(
      createError(401, "You are not authorized to enter this address")
    );
  }
  //verify token
  const decoded = jwt.verify(
    req.cookies.token.split(" ")[1],
    process.env.SECRET_KEY
  );
  const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
  //check if user exists
  if (!user) {
    return next(createError(404, "user has deleted or unactive"));
  }
  // send userInfo with request
  req.user = {
    userId: user.id,
    name: `${user.firstname} ${user.lastname}`,
    phone: user.phone,
    email: user.email,
  };
  next();
};
// ====== end protect section ====
