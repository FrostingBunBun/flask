var loginMessageTimeout = null;

function showLoginMessage(messageId) {
  clearTimeout(loginMessageTimeout);
  
  var loginMessage = document.getElementById('login-message');
  var loginMessage2 = document.getElementById('login-message2');

  if (messageId === 'login-message') {
    loginMessage2.classList.remove('visible');
  } else {
    loginMessage.classList.remove('visible');
  }

  var messageToShow = document.getElementById(messageId);
  messageToShow.classList.add('visible');

  loginMessageTimeout = setTimeout(function() {
    messageToShow.classList.remove('visible');
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