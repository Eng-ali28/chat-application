const express = require("express");
const createError = require("http-errors");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// router sections
const app = express();
app.use(cookieParser());
const corsOptions = {
  origin: function (origin, callback) {
    return callback(null, true);
  },
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));

const httpServer = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(httpServer, { cors: { origin: "*" } });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

const mountRouter = require("./routes/");
mountRouter(app);

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});
const msgIo = io.of("/chat");
msgIo.on("connection", (socket) => {
  socket.on("connectName", (msg) => {
    socket.join(msg.phone);
    socket.emit("connectUser", msg.userId);
  });
  require("./socket/chat")(msgIo, socket);
});
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
