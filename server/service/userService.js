const { prisma } = require("../controller/prismaClient");
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
