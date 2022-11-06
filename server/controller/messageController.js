const createError = require("http-errors");
const {
  prisma,
  errorHandling,
  ClientErrorHandling,
} = require("./prismaClient");
const modelError = require("../utils/prismaErrorHandling");

exports.createMessage = async (req, res, next) => {
  try {
    const { inboxId } = req.params;
    const { content } = req.body;
    const message = await prisma.message.create({
      data: {
        content,
        userId: req.user.userId,
        inboxId,
      },
      select: {
        id: true,
        content: true,
        inboxId: true,
        creator: { select: { id: true, firstname: true, lastname: true } },
        createdAt: true,
      },
    });
    res.status(201).json({ message });
  } catch (error) {
    modelError(next, errorHandling, ClientErrorHandling, "message", error);
  }
};

exports.updateMessage = async (req, res, next) => {
  try {
    const { msgId } = req.params;
    const { content } = req.body;
    const message = await prisma.message.update({
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
    if (!message) {
      next(new Error("there aren't any message with this id"));
    }
    res.status(200).json({ message });
  } catch (error) {
    console.log(error);
    modelError(next, errorHandling, ClientErrorHandling, "message", error);
  }
};

exports.deleteMessage = async (req, res, next) => {
  try {
    const { msgId } = req.params;
    await prisma.message.delete({
      where: { id: msgId },
    });
    res.status(204).send();
  } catch (error) {
    modelError(next, errorHandling, ClientErrorHandling, "message", error);
  }
};

exports.getAllMessages = async (req, res, next) => {
  try {
    const { inboxId } = req.params;
    const messages = await prisma.message.findMany({
      where: { inboxId },
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
    res.status(200).json({ messages });
  } catch (error) {
    modelError(next, errorHandling, ClientErrorHandling, "message", error);
  }
};
