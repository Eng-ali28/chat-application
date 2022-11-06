module.exports = (msgIo, socket) => {
  socket.on("join-room", (opt) => {
    socket.join(opt.roomName);
    msgIo.to(opt.roomName).emit("showMessages", opt);
  });
  socket.on("createMsg", (data) => {
    msgIo.to(data.room).emit("showMsg", {
      creator: data.creator,
      content: data.content,
      date: data.date,
      firstname: data.firstname,
      lastname: data.lastname,
    });
  });
};
