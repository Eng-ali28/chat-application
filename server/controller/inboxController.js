const createError = require("http-errors");
const {
  prisma,
  errorHandling,
  ClientErrorHandling,
} = require("./prismaClient");
const modelError = require("../utils/prismaErrorHandling");
exports.createInbox = async (req, res, next) => {
  try {
    const { friendPhone } = req.params;
    const inbox = await prisma.inbox.create({
      data: {
        user: {
          create: [
            { user: { connect: { phone: friendPhone } } },
            { user: { connect: { phone: req.user.phone } } },
          ],
        },
      },
      select: {
        id: true,
        lastMessageSent: true,
        user: {
          select: {
            user: {
              select: {
                phone: true,
                firstname: true,
                lastname: true,
                email: true,
                status: true,
              },
            },
          },
        },
      },
    });
    res.status(201).json({ inbox });
  } catch (error) {
    console.log(error);
    modelError(next, errorHandling, ClientErrorHandling, "inbox", error);
  }
};

exports.getAllInbox = async (req, res, next) => {
  try {
    const { myPhone } = req.query;
    const inboxes = await prisma.inbox.findMany({
      where: {
        user: { some: { user: { phone: myPhone } } },
      },
      select: {
        id: true,
        lastMessageSent: true,

        user: {
          select: {
            user: {
              select: {
                phone: true,
                firstname: true,
                status: true,
                lastname: true,
                email: true,
              },
            },
          },
        },
      },
    });
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
        user: {
          select: {
            user: {
              select: {
                phone: true,
                firstname: true,
                status: true,
                lastname: true,
                email: true,
              },
            },
          },
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
