

function showLoginMessage() {
    var loginMessage = document.getElementById('login-message');
    loginMessage.classList.add('visible');
    setTimeout(function() {
      loginMessage.classList.remove('visible');
    }, 2000);
  }
  





var leaderBoardsBtn = document.getElementById("leaderboards");
leaderBoardsBtn.addEventListener("click", function() {
  // Redirect to the login page or perform necessary actions
  window.location.href = "/leaderboards";
});

window.addEventListener('DOMContentLoaded', function() {
    var statsButton = document.getElementById("login");
    statsButton.addEventListener("click", function() {
        window.location.href = "login";
    });
});

window.addEventListener('DOMContentLoaded', function() {
    var statsButton = document.getElementById("register");
    statsButton.addEventListener("click", function() {
        window.location.href = "register";
    });
});





// var leaderBoardsBtn = document.getElementById("leaderboards");
// leaderBoardsBtn.addEventListener("click", function() {
//   // Redirect to the login page or perform necessary actions
//   window.location.href = "/leaderboards";
// });