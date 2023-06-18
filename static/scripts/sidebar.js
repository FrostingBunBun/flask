// Get the navigation buttons
const navigationItems = document.querySelectorAll(".navigation-item");


const profileUsername = document.querySelector('.profile-username');
const usernameContent = profileUsername.textContent;

console.log(usernameContent);

// Function to handle navigation item clicks
function handleNavigationItemClick(event) {
  // Get the ID of the clicked navigation item
  const itemId = event.currentTarget.id;

  // Navigate the user to the corresponding path based on the ID
  switch (itemId) {
    case "main":
      window.location.href = "/main"; // Replace "/home" with the desired path for the "Home" button
      break;
 
    case "stats":
      window.location.href = "/stats/" + usernameContent; // Replace "/statistics" with the desired path for the "Statistics" button
      break;
    case "matches":
      window.location.href = "/matches"; // Replace "/matches" with the desired path for the "Matches" button
      break;

      case "matchmaking":
        // Send an AJAX request to the server to check if the user is a moderator
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "/check_mod_status", true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var isModerator = JSON.parse(xhr.responseText).is_moderator;
                // Redirect the user based on their moderator status
                if (isModerator) {
                    window.location.href = "/matchmaking";
                    // console.log("TRUE: ", isModerator)
                } else {
                  // console.log("FALSE: ", isModerator)
                    window.location.href = "/matchmaking/match";
                }
            }
        };
        xhr.send();
        break;
    
    case "leaderboards":
      window.location.href = "/leaderboards"; // Replace "/leaderboard" with the desired path for the "Leaderboard" button
      break;
    default:
      // Handle unknown button clicks or add more cases for additional buttons
      console.log("Unknown button clicked");
      break;
  }
}

// Attach click event listener to each navigation item
navigationItems.forEach((item) => {
  item.addEventListener("click", handleNavigationItemClick);
});

// Get the button element
var logOutButton = document.getElementById("logout");

// Add event listener to the button
logOutButton.addEventListener("click", function () {
  var key = "username"; // Replace with the key of the item you want to delete

  // Make an AJAX request to the Flask route
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/delete-item", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        console.log(response.message);
        window.location.href = "/login";
        // Handle the response as needed
      } else {
        console.log("Error: " + xhr.status);
        // Handle the error as needed
      }
    }
  };
  xhr.send(JSON.stringify({ key: key }));
});


