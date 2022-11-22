const createError = require("http-errors");
const {
  prisma,
  errorHandling,
  ClientErrorHandling,
} = require("./prismaClient");
const modelError = require("../utils/prismaErrorHandling");
const {
  createMsg,
  getMsgs,
  updateMsg,
  deleteMsg,
} = require("../service/messageService");
exports.createMessage = async (req, res, next) => {
  try {
    const { inboxId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;
    const message = await createMsg(content, userId, inboxId);
    res.status(201).json({ message });
  } catch (error) {
    modelError(next, errorHandling, ClientErrorHandling, "message", error);
  }
};

exports.updateMessage = async (req, res, next) => {
  try {
    const { msgId } = req.params;
    const { content } = req.body;
    const message = await updateMsg(msgId, content);
    if (!message) {
      next(new Error("there aren't any message with this id"));
    }
    res.status(200).json({ message });
  } catch (error) {
    modelError(next, errorHandling, ClientErrorHandling, "message", error);
  }
};

exports.deleteMessage = async (req, res, next) => {
  try {
    const { msgId } = req.params;
    await deleteMsg(msgId);
    res.status(204).send();
  } catch (error) {
    modelError(next, errorHandling, ClientErrorHandling, "message", error);
  }
};

exports.getAllMessages = async (req, res, next) => {
  try {
    const { inboxId } = req.params;
    const limit = +req.query.limit || 50;
    const page = +req.query.page || 1;
    const skip = (page - 1) * limit;
    const messages = await getMsgs(inboxId, skip, limit);
    const paginationData = {
      result: messages.length,
      page,
      limit,
    };
    res.status(200).json({ paginationData, messages });
  } catch (error) {
    modelError(next, errorHandling, ClientErrorHandling, "message", error);
  }
};
