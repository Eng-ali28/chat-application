const { prisma } = require("../controller/prismaClient");
const createError = require("http-errors");
// =======Create message=======
exports.createMsg = (content, userId, inboxId) => {
  return new Promise((resolve, reject) => {
    const message = prisma.message.create({
      data: {
        content,
        userId,
        inboxId,
      },
      select: {
        id: true,
        content: true,
        inboxId: true,
        creator: { select: { id: true, firstname: true, lastname: true } },
        createdAt: true,
        inbox: {
          select: { user: { select: { user: { select: { phone: true } } } } },
        },
      },
    });
    resolve(message);
    reject(createError(400, "faild create message"));
  });
};
// ======Get Ll messages=======
exports.getMsgs = (inboxId, skip, limit) => {
  console.log(limit);
  return new Promise((resolve, reject) => {
    const msgs = prisma.message.findMany({
      where: { inboxId },
      skip: skip,
      take: limit,
      select: {
        id: true,
        content: true,
        creator: {
          select: { id: true, firstname: true, lastname: true, email: true },
        },
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    resolve(msgs);
    reject(createError(400, "inboxID is not valid"));
  });
};

// ========= Update message ==========

exports.updateMsg = (msgId, content) => {
  return new Promise((resolve, reject) => {
    const message = prisma.message.update({
      where: { id: msgId },
      data: { content },
      select: {
        id: true,
        content: true,
        inboxId: true,
        creator: { select: { id: true, firstname: true, lastname: true } },
        updatedAt: true,
      },
    });
    resolve(message);
    reject(createError(400, "msgId is not valid"));
  });
};

// ========= Delete message ==========

exports.deleteMsg = (msgId) => {
  return new Promise((resolve, reject) => {
    const message = prisma.message.delete({
      where: { id: msgId },
    });
    resolve(message);
    reject(createError(400, "msgId is not valid"));
  });
};
