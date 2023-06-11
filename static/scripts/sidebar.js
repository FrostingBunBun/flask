// Get the navigation buttons
const navigationItems = document.querySelectorAll(".navigation-item");

// Function to handle navigation item clicks
function handleNavigationItemClick(event) {
  // Get the ID of the clicked navigation item
  const itemId = event.currentTarget.id;

  // Navigate the user to the corresponding path based on the ID
  switch (itemId) {
    case "main":
      window.location.href = "/main"; // Replace "/home" with the desired path for the "Home" button
      break;
    case "matchmaking":
      window.location.href = "/matchmaking"; // Replace "/matchmaking" with the desired path for the "Matchmaking" button
      break;
    case "stats":
      window.location.href = "/statistics"; // Replace "/statistics" with the desired path for the "Statistics" button
      break;
    case "matches":
      window.location.href = "/matches"; // Replace "/matches" with the desired path for the "Matches" button
      break;
    case "leaderboards":
      window.location.href = "/leaderboard"; // Replace "/leaderboard" with the desired path for the "Leaderboard" button
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
