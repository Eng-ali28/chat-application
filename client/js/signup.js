const form = document.querySelector("form");
import axios from "axios";
let arr = [];
document.addEventListener("DOMContentLoaded", function () {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = {
      firstname: firstname.value,
      lastname: lastname.value,
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
    };

    axios
      .post("http://localhost:3000/api/v1/user", formData)
      .then((res) => {
        console.log(res);
        if (res.data.errors) {
          res.data.errors.forEach((ele) => {
            if (!arr.includes(ele.msg)) {
              errorBox.innerHTML += `<li>${ele.msg}</li>`;
              arr.push(ele.msg);
            }
          });
        }
        if (res.status >= 200 && res.status < 204) {
          localStorage.setItem("userId", JSON.stringify(res.data.data.id));
          window.location.href = "http://localhost:8080";
        }
      })
      .catch((err) => console.log(err));
  });
});
