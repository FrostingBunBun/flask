var homeBtn = document.getElementById("home");
homeBtn.addEventListener("click", function() {
    // Redirect to the login page or perform necessary actions
    window.location.href = "/main";
});

var backBtn = document.getElementById("back");
backBtn.addEventListener("click", function() {
    // Redirect to the login page or perform necessary actions
    window.history.back();
});
