import { io } from "socket.io-client";
import axios from "axios";

// ======global element======
let userId, sName, sEmail;
if (localStorage.getItem("user")) {
  userId = JSON.parse(localStorage.getItem("user")).userId;
  sName = JSON.parse(localStorage.getItem("user")).name;
  sEmail = JSON.parse(localStorage.getItem("user")).email;
  myName.innerText = sName;
  myEmail.innerText = sEmail;
}

// ======global function=====
if (userId) {
  signup.style.display = "none";
  login.style.display = "none";
  logout.style.display = "block";
  getMychats(userId);
}
if (!userId && window.location.pathname == "/chat.html") {
  window.location.pathname = "/";
}
logout.onclick = async function (e) {
  e.preventDefault();
  localStorage.removeItem("user");
  window.location.href = "http://localhost:8080/";
};

// ======get my chats========
async function getMychats(userId) {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/v1/inbox/?myId=${userId}`,
      { withCredentials: true }
    );
    console.log(response);
    const chats = response.data.inboxes
      .map((ele) => {
        return ele.userId.filter((element) => element.id !== userId);
      })
      .flat();
    chats.forEach((friend) => {
      const li = document.createElement("li");
      li.setAttribute("id", "chatEle");
      li.classList.add("nameFriend", "offline");
      li.innerText = `${friend.firstname} ${friend.lastname}  \n${response.data.inboxes[0].id}`;
      listChat.appendChild(li);
    });
  } catch (error) {
    console.log(error);
  }
}
// ======socket section======
const socketMsg = io("http://localhost:3000/chat");
socketMsg.on("connect", () => {
  socketMsg.emit("connectName", sName);
  console.log("connect");
});
addBtn.addEventListener("click", async (e) => {
  try {
    e.preventDefault();
    const inboxInfo = await axios.post(
      `http://localhost:3000/api/v1/inbox/${addInput.value}`,
      {},
      { withCredentials: true }
    );
  } catch (error) {
    console.log(error);
  }
});
let roomVal;
goRoom.addEventListener("click", async (e) => {
  try {
    e.preventDefault();
    roomVal = room.value;
    socketMsg.emit("join-room", { roomName: room.value, userId });
    room.value = "";
  } catch (error) {
    console.log(error);
  }
});
sendMsg.addEventListener("click", async (e) => {
  e.preventDefault();
  const response = await axios.post(
    `http://localhost:3000/api/v1/messages/${roomVal}`,
    { content: message.value },
    { withCredentials: true }
  );
  const msg = response.data.message;
  socketMsg.emit("createMsg", {
    content: msg.content,
    creator: msg.creator.id,
    firstname: msg.creator.firstname,
    lastname: msg.creator.lastname,
    room: msg.inboxId,
    date: msg.createdAt.substring(0, 10),
  });
  console.log(response);
  message.value = "";
});
async function displayMsg() {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/v1/messages/${roomVal}`,
      { withCredentials: true }
    );
    const messageInfo = response.data.messages;
    console.log(messageInfo);
    messageInfo.forEach((ele) => {
      console.log(ele);
      pushMsg(ele);
    });
  } catch (error) {
    console.log(error);
  }
}
socketMsg.on("showMessages", (opt) => {
  displayMsg();
});
socketMsg.on("showMsg", (ele) => {
  pushMsg(ele);
});

function pushMsg(ele) {
  const msg = document.createElement("div");
  let name = ele.firstname
    ? `${ele.firstname} ${ele.lastname}`
    : `${ele.creator.firstname} ${ele.creator.lastname}`;
  if (ele.creator.id == userId || ele.creator == userId) {
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
  nameMsg.innerText = name;
  mainMsg.innerText = ele.content;
  dateMsg.innerText = ele.date ? ele.date : ele.createdAt.substring(0, 10);
  msg.appendChild(nameMsg);
  msg.appendChild(mainMsg);
  msg.appendChild(dateMsg);
  return msgBox.appendChild(msg);
}
