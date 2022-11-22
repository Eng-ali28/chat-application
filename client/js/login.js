// import axios from "axios";
const baseURL = "https://chat-idea.herokuapp.com";
const secondURL = "https://eng-ali28.github.io/chat-application-client";
axios.defaults.withCredentials = true;
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = { email: email.value, password: password.value };
  const response = await axios.post(`${baseURL}/api/v1/auth/login`, formData, {
    withCredentials: true,
  });
  if (response.data.errors) {
    errorBox.innerHTML = "";
    response.data.errors.forEach((element) => {
      const li = document.createElement("li");
      li.innerText = element.msg;
      li.classList.add("my-2", "text-red-600");
      errorBox.classList.remove("hidden");
      errorBox.appendChild(li);
    });
  }
  if (!response.data.errors) {
    errorBox.classList.add("hidden");
  }
  if (response.data.user) {
    localStorage.setItem(
      "user",
      JSON.stringify({
        userId: response.data.user.id,
        name: `${response.data.user.firstname} ${response.data.user.lastname}`,
        email: response.data.user.email,
        phone: response.data.user.phone,
      })
    );

    window.location.replace(`${secondURL}/chat.html`);
  }
});
