

// Function to show the popup with a countdown
function showPopup(message, durationInSeconds, nameLeft, nameRight, spectateLink) {



    const popupContainer = document.getElementById("popup-container");
    const popupMessage = document.getElementById("popup-message");
    const popupCountdown = document.getElementById("popup-countdown");
    const teamLeft = document.getElementById("team-left");
    const teamRight = document.getElementById("team-right");
    const vs = document.getElementById("vs");
    const spectateLinkElement = document.getElementById("spectate-link");

    // Set the message and team names in the popup
    popupMessage.textContent = message;
    teamLeft.textContent = nameLeft;
    teamRight.textContent = nameRight;
    spectateLinkElement.textContent = "Click to spectate";
    spectateLinkElement.href = spectateLink;

    // Show the popup
    popupContainer.style.display = "flex";

    // Countdown timer
    let remainingTime = durationInSeconds;
    popupCountdown.textContent = remainingTime;

    const countdownInterval = setInterval(() => {
      remainingTime--;
      popupCountdown.textContent = remainingTime;

      // If the countdown reaches 0, hide the popup and clear the interval
      if (remainingTime <= 0) {
        popupContainer.style.display = "none";
        clearInterval(countdownInterval);
      }
    }, 1000);
  
  console.log("help")
}

// Set up the SSE connection
const eventSource = new EventSource('/sse-match-status');
let previousStatus = null;

// Listen for SSE messages and call the handleSSE function
eventSource.addEventListener('match_status', function (event) {
  // Parse the data sent from the server (assuming it's a JSON string)
  const data = JSON.parse(event.data);

  // Check if the current status is different from the previous status
  if (data.status !== previousStatus) {
    // Update the previousStatus with the current status
    previousStatus = data.status;
    console.log(data)
    // Check if the current status is "Ongoing"
    if (data.status === "Ongoing") {
      // Show the popup with a 10-second countdown
      showPopup("Match has started!", 10, data.nameLeft, data.nameRight, "/spectate");
    }
  }
});
