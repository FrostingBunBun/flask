// Set initial button states
let leftButtonClicks = 0;
let rightButtonClicks = 0;

// Left button click handler
function leftButtonClicked() {
    rightButtonClicks = 0;
    leftButtonClicks++;

    if (leftButtonClicks === 1) {
        // First click on left button
        console.log("Left button clicked (1st time). Changing text to 'Confirm'.");
        document.getElementById("leftButton").textContent = "Confirm";
        document.getElementById("rightButton").textContent = "Right Button"; // Reset left button text
    } else if (leftButtonClicks === 2) {
        // Second click on left button
        console.log("Left button clicked (2nd time). Redirecting...");
        // Perform the redirect action for left button
        redirect("left");
        resetButtons();
    }
}

// Right button click handler
function rightButtonClicked() {
    leftButtonClicks = 0;
    rightButtonClicks++;

    if (rightButtonClicks === 1) {
        // First click on right button
        console.log("Right button clicked (1st time). Changing text to 'Confirm'.");
        document.getElementById("rightButton").textContent = "Confirm";
        document.getElementById("leftButton").textContent = "Left Button"; // Reset left button text
    } else if (rightButtonClicks === 2) {
        // Second click on right button
        console.log("Right button clicked (2nd time). Redirecting...");
        // Perform the redirect action for right button
        redirect("right");
        resetButtons();
    }
}

// Function to perform the redirect action
function redirect(button) {
    // Perform the redirect based on the button clicked
    console.log("Redirecting to", button, "button destination...");
}

// Function to reset button states
function resetButtons() {
    leftButtonClicks = 0;
    rightButtonClicks = 0;
    document.getElementById("leftButton").textContent = "Left Button"; // Reset left button text
    document.getElementById("rightButton").textContent = "Right Button"; // Reset right button text
}

// Example usage:
// Assuming you have HTML buttons with ids "leftButton" and "rightButton"
document.getElementById("leftButton").addEventListener("click", leftButtonClicked);
document.getElementById("rightButton").addEventListener("click", rightButtonClicked);
