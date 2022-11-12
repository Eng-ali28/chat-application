module.exports = (msgIo, socket) => {
  socket.on("join-room", (opt) => {
    socket.join(opt.roomName);
    msgIo.to(opt.roomName).emit("showMessages", opt);
  });
  socket.on("createMsg", (data) => {
    msgIo.to(data.friendId).emit("notyMsg", {
      firstname: data.firstname,
      lastname: data.lastname,
      inboxId: data.room,
    });
    msgIo.to(data.room).emit("showMsg", {
      creator: data.creator,
      content: data.content,
      date: data.date,
      firstname: data.firstname,
      lastname: data.lastname,
    });
  });
  socket.on("add-chat", (obj, cb) => {
    cb(obj.myPhone);
    msgIo.to(obj.friend).emit("get-chat", obj.friend, cb);
  });
  socket.on("disconnect", () => {
    socket.emit("disconnected");
  });
};
