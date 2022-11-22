const userRouter = require("./userRouter");
const authRouter = require("./authRouter");
const messageRouter = require("./messageRouter");
const inboxRouter = require("./inboxRouter");
const rateLimet = require("../middleware/rateLimitMW");
module.exports = (app) => {
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/messages", messageRouter);
  app.use("/api/v1/inbox", inboxRouter);
};
