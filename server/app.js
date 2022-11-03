const express = require("express");
const createError = require("http-errors");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

// router section
const app = express();
app.use(cors({ origin: "*" }));
const httpServer = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(httpServer, { cors: { origin: "*" } });

const mountRouter = require("./routes/");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(morgan("dev"));

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
// io.on("connection", (socket) => {
//   console.log(`connection with ${socket.id}`);
//   require("./socket/chat")(io, socket);
// });
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
