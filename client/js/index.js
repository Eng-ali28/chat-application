// import { io } from "socket.io-client";
// import axios from "axios";

// ======global element======
let userId, sName, sEmail, sPhone;
const notification = document.querySelector(".notification");
const notBtn = notification.querySelector(".notBtn");
const notData = notification.querySelector(".notData");
if (localStorage.getItem("user")) {
  userId = JSON.parse(localStorage.getItem("user")).userId;
  sName = JSON.parse(localStorage.getItem("user")).name;
  sEmail = JSON.parse(localStorage.getItem("user")).email;
  sPhone = JSON.parse(localStorage.getItem("user")).phone;
  myName.innerText = sName;
  myEmail.innerText = sPhone;
}
const baseURL = "https://chat-idea.herokuapp.com";
axios.defaults.withCredentials = true;
// ======global function=====
if (userId) {
  signup.style.display = "none";
  login.style.display = "none";
  logout.style.display = "block";
  notification.style.display = "block";
  notBtn.style.display = "block";
  getMychats(sPhone);
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
async function getMychats(phone) {
  try {
    listChat.innerHTML = "";
    const response = await axios.get(
      `${baseURL}/api/v1/inbox/?myPhone=${phone}`,
      { withCredentials: true }
    );
    const chats = response.data.inboxes.filter((ele) => ele.user.length > 1);
    chats.forEach((friend) => {
      const { user } = friend.user.find((ele) => ele.user.phone !== phone);
      const li = document.createElement("li");
      li.setAttribute("id", "chatEle");
      if (user.status == "offline") {
        li.classList.add("nameFriend", "offline");
      } else {
        li.classList.add("nameFriend", "active");
      }
      li.innerText = `${user.firstname} ${user.lastname}  \n`;
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

// ======socket section======
const socketMsg = io(`${baseURL}/chat`);
socketMsg.on("connect", async () => {});
socketMsg.emit("connectName", { name: sName, phone: sPhone, userId });
socketMsg.on("connectUser", async (userId) => {
  const user = await axios.patch(
    `${baseURL}/api/v1/user/${userId}/online`,
    {},
    { withCredentials: true }
  );
  socketMsg.emit("changeStatus", userId);
});
addBtn.addEventListener("click", async (e) => {
  try {
    e.preventDefault();
    if (addInput.value == "") return;
    const response = await axios.post(
      `${baseURL}/api/v1/inbox/${addInput.value}`,
      {},
      { withCredentials: true }
    );
    socketMsg.emit(
      "add-chat",
      { friend: addInput.value, myPhone: sPhone },
      (fr) => getMychats(fr)
    );
    addInput.value = "";
  } catch (error) {
    console.log("from here", error);
  }
});

sendMsg.addEventListener("click", async (e) => {
  try {
    e.preventDefault();
    const url = new URL(window.location.href).searchParams;
    const roomVal = url.get("id");
    if (!roomVal) return new Error("can't join to this room.");
    const response = await axios.post(
      `${baseURL}/api/v1/messages/${roomVal}`,
      { content: message.value },
      { withCredentials: true }
    );
    const msg = response.data.message;
    const friendId = msg.inbox.user.find((ele) => ele.user.phone !== sPhone);
    socketMsg.emit("createMsg", {
      content: msg.content,
      creator: msg.creator.id,
      firstname: msg.creator.firstname,
      lastname: msg.creator.lastname,
      room: msg.inboxId,
      friendId: friendId.user.phone,
      date: msg.createdAt.substring(0, 10),
    });
    message.value = "";
  } catch (error) {}
});
async function displayMsg(roomVal) {
  try {
    msgBox.innerHTML = "";
    const response = await axios.get(`${baseURL}/api/v1/messages/${roomVal}`, {
      withCredentials: true,
    });
    const messageInfo = response.data.messages;
    messageInfo.forEach((ele) => {
      pushMsg(ele);
    });
  } catch (error) {
    console.log(error);
  }
}
socketMsg.on("showMessages", (opt) => {
  displayMsg(opt.roomName);
});
socketMsg.on("showMsg", (ele) => {
  pushMsg(ele);
});
socketMsg.on("get-chat", (friend) => {
  getMychats(friend);
});
const secondURL = "https://eng-ali28.github.io/chat-application-client";
logout.onclick = async function (e) {
  try {
    e.preventDefault();
    window.location.href = `${secondURL}`;

    await axios.patch(
      `${baseURL}/api/v1/user/${userId}/offline`,
      {},
      { withCredentials: true }
    );
    await axios.post(
      `${baseURL}/api/v1/auth/logout`,
      {},
      { withCredentials: true }
    );
    localStorage.removeItem("user");
  } catch (error) {
    console.log(error);
  }
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
  msgBox.scrollTop = msgBox.scrollHeight - msgBox.clientHeight + 200;

  return msgBox.appendChild(msg);
}
// ======notification section======
function addNotification(fname, lname) {
  const listNotification = document.createElement("li");
  listNotification.innerText = `message from ${fname} ${lname}`;
  notData.appendChild(listNotification);
}
socketMsg.on("notyMsg", (data) => {
  addNotification(data.firstname, data.lastname);
  notBtn.classList.add("active");
});
notBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (notBtn.getAttribute("attr-show") == "hide") {
    notBtn.setAttribute("attr-show", "show");
    notBtn.classList.remove("active");
    notData.style.display = "block";
    if (notData.innerHTML == "") {
      notData.innerHTML = `<li>Nothing</li>`;
    } else {
      notBtn.innerHTML = "";
    }
  } else if (notBtn.getAttribute("attr-show") == "show") {
    notBtn.setAttribute("attr-show", "hide");
    notData.style.display = "none";
  }
});
const url = new URL(window.location.href);

document.addEventListener("click", (e) => {
  if (e.target.id == "chatEle" || e.target.classList.contains("chatIds")) {
    const room = e.target.querySelector(".chatIds").innerText;

    url.searchParams.set("id", room);
    window.history.pushState({}, "", url);
    try {
      e.preventDefault();
      socketMsg.emit("join-room", { roomName: room, userId });
    } catch (error) {
      console.log(error);
    }
  }
});
