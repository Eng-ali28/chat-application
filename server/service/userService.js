const { prisma } = require("../controller/prismaClient");
const createError = require("http-errors");
exports.setOffline = (userId) => {
  return new Promise((resolve, reject) => {
    const user = prisma.user.update({
      where: { id: userId },
      data: {
        status: "offline",
      },
    });
    resolve(user);
    reject(new Error("something went error"));
  });
};

exports.setOnline = (userId) => {
  return new Promise((resolve, reject) => {
    const user = prisma.user.update({
      where: { id: userId },
      data: { status: "online" },
    });
    resolve(user);
    reject(createError(400, "something went wronge when set user online"));
  });
};
