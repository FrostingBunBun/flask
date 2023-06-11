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
    case "matchmaking":
      window.location.href = "/matches"; // Replace "/matches" with the desired path for the "Matches" button
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
