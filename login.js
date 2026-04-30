(function () {
  const form = document.getElementById("loginForm");
  const message = document.getElementById("loginMessage");

  if (!form) {
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username.length < 2) {
      message.textContent = "Username must be at least 2 characters.";
      message.className = "error";
      return;
    }

    if (password.length < 4) {
      message.textContent = "Password must be at least 4 characters.";
      message.className = "error";
      return;
    }

    localStorage.setItem("todoUser", username);
    message.textContent = "Login successful. Redirecting...";
    message.className = "success";

    setTimeout(function () {
      window.location.href = "home.html";
    }, 500);
  });
})();
