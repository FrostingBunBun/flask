var homeBtn = document.getElementById("homeBtn");
homeBtn.addEventListener("click", function () {
  // Redirect to the login page or perform necessary actions
  window.location.href = "/main";
});

var registerBtn = document.getElementById("register");
registerBtn.addEventListener("click", function () {
  // Redirect to the login page or perform necessary actions
  window.location.href = "/register";
});

window.addEventListener("DOMContentLoaded", function () {
  var statsButton = document.getElementById("register");
  statsButton.addEventListener("click", function () {
    window.location.href = "/register";
  });
});
