var login = document.getElementById("matchmaking");
login.addEventListener("click", function() {
    // Redirect to the registration page or perform necessary actions
    window.location.href = "/matchmaking";
});

// Get the button element
var logOutButton = document.getElementById('logout');

// Add event listener to the button
logOutButton.addEventListener('click', function() {
    var key = 'username'; // Replace with the key of the item you want to delete
    
    // Make an AJAX request to the Flask route
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/delete-item', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // var response = JSON.parse(xhr.responseText);
                // console.log(response.message);
                window.location.href = "/main"
                // Handle the response as needed
            } else {
                console.log('Error: ' + xhr.status);
                // Handle the error as needed
            }
        }
    };
    xhr.send(JSON.stringify({ 'key': key }));
});



window.addEventListener('DOMContentLoaded', function() {
    var statsButton = document.getElementById("stats");
    statsButton.addEventListener("click", function() {
        window.location.href = "/stats";
    });
});

window.addEventListener('DOMContentLoaded', function() {
    var statsButton = document.getElementById("matches");
    statsButton.addEventListener("click", function() {
        window.location.href = "/matches";
    });
});




var leaderBoardsBtn = document.getElementById("leaderboards");
leaderBoardsBtn.addEventListener("click", function() {
  // Redirect to the login page or perform necessary actions
  window.location.href = "/leaderboards";
});