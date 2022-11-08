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
const arrow = document.getElementById("arrow");
const chatInfo = document.getElementById("chatInfo");

// ======show/hide sidebar===
arrow.addEventListener("click", (e) => {
  e.preventDefault();
  if (chatInfo.getAttribute("attr-show") == "hidden") {
    Object.assign(chatInfo, { style: "transform:translateX(0px);" });
    Object.assign(arrow, { style: "transform:rotate(180deg);" });
    chatInfo.setAttribute("attr-show", "visible");
  } else {
    Object.assign(chatInfo, { style: "transform:translateX(-95%);" });
    Object.assign(arrow, { style: "transform:rotate(0deg);" });
    chatInfo.setAttribute("attr-show", "hidden");
  }
});
// ======get my chats========
async function getMychats(userId) {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/v1/inbox/?myId=${userId}`,
      { withCredentials: true }
    );
    // const chats = response.data.inboxes
    //   .map((ele) => {
    //     return ele.userId.filter((element) => element.id !== userId);
    //   })
    //   .flat();
    console.log(userId);
    const chats = response.data.inboxes.filter((ele) => ele.userId.length > 1);
    console.log(chats);
    chats.forEach((friend) => {
      const data = friend.userId.find((ele) => ele.id != userId);
      // console.log(data);
      const li = document.createElement("li");
      li.setAttribute("id", "chatEle");
      if (data.status == "offline") {
        li.classList.add("nameFriend", "offline");
      } else {
        li.classList.add("nameFriend", "active");
      }
      li.innerText = `${data.firstname} ${data.lastname}  \n`;
      const span = document.createElement("span");
      span.className = "chatIds";
      span.innerText = `${friend.id}`;
      li.appendChild(span);
      listChat.appendChild(li);
    });
  } catch (error) {
    console.log(error);
  }
}

setTimeout(() => {
  const chatId = document.querySelectorAll(".chatIds");
  const arrChat = [...chatId];
  for (let ele of arrChat) {
    ele.onclick = (e) => {
      navigator.clipboard.writeText(ele.innerText);
      room.value = ele.innerText;
    };
  }
}, 300);

// ======socket section======
const socketMsg = io("http://localhost:3000/chat");
socketMsg.on("connect", async () => {});
socketMsg.emit("connectName", { name: sName, userId });
socketMsg.on("connectUser", async (userId) => {
  await axios.patch(
    `http://localhost:3000/api/v1/user/${userId}/online`,
    {},
    { withCredentials: true }
  );
  socketMsg.emit("changeStatus", userId);
});
addBtn.addEventListener("click", async (e) => {
  try {
    e.preventDefault();
    const inboxInfo = await axios.post(
      `http://localhost:3000/api/v1/inbox/${addInput.value}`,
      {},
      { withCredentials: true }
    );
    window.location.reload();
    console.log(inboxInfo);
  } catch (error) {
    console.log("from here", error);
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
  message.value = "";
});
async function displayMsg() {
  try {
    msgBox.innerHTML = "";
    const response = await axios.get(
      `http://localhost:3000/api/v1/messages/${roomVal}`,
      { withCredentials: true }
    );
    const messageInfo = response.data.messages;
    console.log(messageInfo);
    messageInfo.forEach((ele) => {
      pushMsg(ele);
    });
  } catch (error) {
    console.log(error);
  }
}
socketMsg.on("showMessages", () => {
  displayMsg();
});
socketMsg.on("showMsg", (ele) => {
  pushMsg(ele);
});
logout.onclick = async function (e) {
  e.preventDefault();
  localStorage.removeItem("user");
  await axios.patch(
    `http://localhost:3000/api/v1/user/${userId}/offline`,
    {},
    { withCredentials: true }
  );
  await axios.post(
    "http://localhost:3000/api/v1/auth/logout",
    {},
    { withCredentials: true }
  );
  window.location.href = "http://localhost:8080/";
};

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
