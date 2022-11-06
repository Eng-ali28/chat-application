const createError = require("http-errors");
const {
  prisma,
  errorHandling,
  ClientErrorHandling,
} = require("./prismaClient");
const modelError = require("../utils/prismaErrorHandling");
exports.createInbox = async (req, res, next) => {
  try {
    const { friendId } = req.params;
    const inbox = await prisma.inbox.create({
      data: {
        userId: { connect: [{ id: friendId }, { id: req.user.userId }] },
      },
      select: {
        id: true,
        lastMessageSent: true,
        userId: {
          select: { id: true, firstname: true, lastname: true, email: true },
        },
      },
    });
    res.status(201).json({ inbox });
  } catch (error) {
    modelError(next, errorHandling, ClientErrorHandling, "inbox", error);
  }
};

exports.getAllInbox = async (req, res, next) => {
  try {
    const { myId } = req.query;
    console.log(`my id ${myId}`);
    const inboxes = await prisma.inbox.findMany({
      where: {
        userId: { some: { id: myId } },
      },
      select: {
        id: true,
        lastMessageSent: true,
        userId: {
          select: { id: true, firstname: true, lastname: true, email: true },
        },
      },
    });
    console.log(inboxes);
    res.status(200).json({ inboxes });
  } catch (error) {
    modelError(next, errorHandling, ClientErrorHandling, "inbox", error);
  }
};

exports.getSpecificInbox = async (req, res, next) => {
  try {
    const { inboxId } = req.params;
    const inbox = await prisma.inbox.findUnique({
      where: { id: inboxId },
      select: {
        id: true,
        lastMessageSent: true,
        userId: {
          select: { id: true, firstname: true, lastname: true, email: true },
        },
        messages: {
          select: { content: true, userId: true },
        },
      },
    });
    res.status(200).json({ inbox });
  } catch (error) {
    modelError(next, errorHandling, ClientErrorHandling, "inbox", error);
  }
};

exports.deleteInbox = async (req, res, next) => {
  try {
    const { inboxId } = req.params;
    await prisma.inbox.delete({
      where: { id: inboxId },
    });
    res.status(204).send();
  } catch (error) {
    modelError(next, errorHandling, ClientErrorHandling, "inbox", error);
  }
};
