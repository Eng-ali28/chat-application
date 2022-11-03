import { io } from "socket.io-client";
const socket = io("http://localhost:3000");
socket.on("connect", () => {
  console.log("connect");
});
// ======global element======
const userId = localStorage.getItem("userId");

// ======global function=====
if (userId) {
  signup.style.display = "none";
  login.style.display = "none";
  logout.style.display = "block";
}
logout.onclick = function (e) {
  localStorage.removeItem("userId");
};
function displayMsg(message, id) {
  const msg = document.createElement("div");

  if (message.name == id) {
    msg.className = "msg sender";
  } else {
    msg.className = "msg reciver";
  }
  const nameMsg = document.createElement("p");
  const mainMsg = document.createElement("p");
  const dateMsg = document.createElement("p");
  nameMsg.className = "msg-name";
  mainMsg.className = "main-msg";
  dateMsg.className = "msg-date";
  nameMsg.innerText = message.name;
  mainMsg.innerText = message.body;
  dateMsg.innerText = message.date;
  msg.appendChild(nameMsg);
  msg.appendChild(mainMsg);
  msg.appendChild(dateMsg);
  console.log(msg);
  return msgBox.appendChild(msg);
}
// ======socket section======

sendMsg.addEventListener("click", (e) => {
  socket.emit("sendMsg", message.value);
  message.value = "";
});
goRoom.addEventListener("click", (e) => {
  socket.emit("joining", room.value);
  room.value = "";
});

socket.on("printMsg", (obj) => {
  displayMsg(obj, socket.id);
});
