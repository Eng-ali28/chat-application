const form = document.querySelector("form");
import axios from "axios";

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const formData = {
    firstname: firstname.value,
    lastname: lastname.value,
    email: email.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
  };

  const response = await axios.post(
    "http://localhost:3000/api/v1/auth/signup",
    formData,
    { withCredentials: true }
  );

  if (response.data.errors) {
    errorBoxSign.innerHTML = "";
    response.data.errors.forEach((ele) => {
      const li = document.createElement("li");
      li.innerText = ele.msg;
      li.classList.add("my-2", "text-red-600");
      errorBoxSign.appendChild(li);
      errorBoxSign.classList.remove("hidden");
    });
  }
  if (!response.data.errors) {
    errorBoxSign.classList.add("hidden");
    localStorage.setItem(
      "user",
      JSON.stringify({
        userId: response.data.user.id,
        name: `${response.data.user.firstname} ${response.data.user.lastname}`,
        email: response.data.user.email,
      })
    );
    window.location.href = "http://localhost:8080/chat.html";
  }
});
