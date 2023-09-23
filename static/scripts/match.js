window.onload = function () {
  if (!localStorage.getItem('pageReloaded')) {
    localStorage.setItem('pageReloaded', 'true');
    location.reload();
  }
  localStorage.removeItem("buttonClicked");
};

// window.addEventListener("load", function () {
//   var leftGaugeElement = document.getElementById("leftGauge");
//   leftGaugeElement.classList.add("fade-in");

//   var rightGaugeElement = document.getElementById("rightGauge");
//   rightGaugeElement.classList.add("fade-in");
// });
window.addEventListener("load", function () {
  var bottomPartElement = document.querySelector(".bottomPart");
  bottomPartElement.classList.add("fade-in");
});

function convertDurationToSeconds(duration) {
  var timeParts = duration.split(":");
  var hours = parseInt(timeParts[0]);
  var minutes = parseInt(timeParts[1]);
  var seconds = parseInt(timeParts[2]);

  var totalSeconds = hours * 3600 + minutes * 60 + seconds;

  return totalSeconds;
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("LENGTH COOKIE: ", document.cookie.length);
  function calculateWinProbabilities(
    leftRating,
    rightRating,
    leftWinrate,
    rightWinrate
  ) {
    if (
      leftWinrate < 0 ||
      leftWinrate > 1 ||
      rightWinrate < 0 ||
      rightWinrate > 1
    ) {
      throw new Error("Win rates should be between 0 and 1 (inclusive).");
    }

    leftRating = parseFloat(leftRating);
    rightRating = parseFloat(rightRating);
    leftWinrate = parseFloat(leftWinrate);
    rightWinrate = parseFloat(rightWinrate);

    if (leftRating == 0) {
      leftRating = 1;
    }
    if (rightRating == 0) {
      rightRating = 1;
    }
    if (leftWinrate == 0) {
      leftWinrate = 20;
    }
    if (rightWinrate == 0) {
      rightWinrate = 20;
    }

    // console.log("leftRating: ", leftRating);
    // console.log("rightRating: ", rightRating);
    // console.log("leftWinrate: ", leftWinrate);
    // console.log("rightWinrate: ", rightWinrate);

    // Introduce a scaling factor to amplify the effect of win rate
    var winRateScalingFactor = 2; // Adjust this factor as desired

    // Calculate win probabilities based on the weighted average of ratings and win rates
    var leftProbability = leftRating * leftWinrate ** winRateScalingFactor;
    var rightProbability = rightRating * rightWinrate ** winRateScalingFactor;

    // Normalize probabilities to ensure they sum up to 1
    var sumProbabilities = leftProbability + rightProbability;
    var normalizedLeftProbability = leftProbability / sumProbabilities;
    var normalizedRightProbability = rightProbability / sumProbabilities;
    // console.log("sumProbabilities: ", sumProbabilities);
    // console.log("normalizedLeftProbability: ", normalizedLeftProbability);
    // console.log("normalizedRightProbability: ", normalizedRightProbability);

    return [normalizedRightProbability, normalizedLeftProbability];
  }

  //   if (leftRating == 0){
  //     leftRating = 0.01
  // }
  // if (rightRating == 0){
  //     rightRating = 0.01
  // }
  // if (leftWinrate == 0){
  //     leftWinrate = 0.01
  // }
  // if (rightWinrate == 0){
  //     rightWinrate = 0.01
  // }
  // console.log("leftRating: ", leftRating);
  // console.log("rightRating: ", rightRating);
  // console.log("leftWinrate: ", leftWinrate);
  // console.log("rightWinrate: ", rightWinrate);

  var toMaking = document.getElementById("toMaking");

  toMaking.addEventListener("click", function () {



    
    // Get player names from HTML
    const leftPlayerName = document.getElementById("leftNAME").textContent;
    const rightPlayerName = document.getElementById("rightNAME").textContent;
    const leftRatingNumber = parseInt(
      document.getElementById("leftMMR").textContent
    );
    const rightRatingNumber = parseInt(
      document.getElementById("rightMMR").textContent
    );
    // Get other data if needed

    // Create an object to hold the data
    const requestData = {
      playerLeft: leftPlayerName,
      playerRight: rightPlayerName,
      left_mmr: leftRatingNumber,
      right_mmr: rightRatingNumber,
      // Include other data here
    };

    // Make a POST request to the Flask endpoint
    fetch("/clear-database", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data.message);
        window.location.href = "/matchmaking";
      })
      .catch((error) => {
        console.error("Error occurred:", error);
      });
  });

  var refreshFlag = sessionStorage.getItem("refreshFlag");

  if (refreshFlag !== "true") {
    // Set the session variable to indicate that refresh has been triggered
    sessionStorage.setItem("refreshFlag", "true");

    // Perform the page refresh
    // window.location.reload();
  }

  // Function to update the gauge based on two values
  function updateGauge(value1, value2) {
    var fill1 = document.getElementById("fill1");
    var fill2 = document.getElementById("fill2");

    // Calculate the proportions
    var total = value1 + value2;
    var proportion1 = value1 / total;
    var proportion2 = value2 / total;

    // Set the width and left position of the fills based on proportions
    fill1.style.width = proportion1 * 100 + "%";
    fill2.style.width = proportion2 * 100 + "%";
    fill2.style.left = proportion1 * 100 + "%";
  }

  var leftRatingElement = document.querySelector(".rating1");
  var leftRatingValue = leftRatingElement
    ? leftRatingElement.textContent.trim().match(/\d+/)
    : "";
  // console.log("left Rating value:", leftRatingValue);

  var rightRatingElement = document.querySelector(".rating2");
  var rightRatingValue = rightRatingElement
    ? rightRatingElement.textContent.trim().match(/\d+/)
    : "";

  var leftWinrateElement = document.querySelector(".additionalNumber1");
  var leftWinrateValue = leftWinrateElement
    ? leftWinrateElement.textContent.trim().replace("Winrate: ", "")
    : "";
  // console.log("left Winrate value:", leftWinrateValue);

  var rightWinrateElement = document.querySelector(".additionalNumber2");
  var rightWinrateValue = rightWinrateElement
    ? rightWinrateElement.textContent.trim().replace("Winrate: ", "")
    : "";
  // console.log("right Winrate value:", rightWinrateValue);

  console.log("leftWinrate MATCH: ", leftWinrateValue);
  console.log("leftWinrate MATCH TYPE: ", typeof leftWinrateValue);
  console.log("rightWinrate MATCH: ", rightWinrateValue);
  console.log("rightWinrate MATCH TYPE: ", typeof rightWinrateValue);

  var [rightProbability, leftProbability] = calculateWinProbabilities(
    leftRatingValue,
    rightRatingValue,
    leftWinrateValue,
    rightWinrateValue
  );

  // console.log("Left player's probability of winning:", leftProbability);
  // console.log("Right player's probability of winning:", rightProbability);

  // var percentageLeft = (leftProbability * 100).toFixed(2) + "%";
  // var percentageRight = (rightProbability * 100).toFixed(2) + "%";

  // var leftPercentElement = document.getElementById("leftGauge");
  // leftPercentElement.textContent = percentageLeft;

  // var rightPercentElement = document.getElementById("rightGauge");
  // rightPercentElement.textContent = percentageRight;

  // Example usage: update the gauge with values 60 and 40
  // updateGauge(leftProbability, rightProbability);

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Set initial button states
  let leftButtonClicks = 0;
  let rightButtonClicks = 0;

  // Left button click handler
  function leftButtonClicked() {
    rightButtonClicks = 0;
    leftButtonClicks++;

    if (leftButtonClicks === 1) {
      // First click on left button
      console.log(
        "Left button clicked (1st time). Changing text to 'Confirm'."
      );
      document.getElementById("leftButton").textContent = "Confirm";
      document.getElementById("rightButton").textContent = "WON"; // Reset left button text
    } else if (leftButtonClicks === 2) {
      // Second click on left button
      console.log("Left button clicked (2nd time). Redirecting...");
      // Perform the redirect action for left button
      var matchDurationElement = document.getElementById("match-duration");
      var duration = matchDurationElement.textContent;

      var totalSeconds = convertDurationToSeconds(duration);
      console.log("Match Duration (seconds):", totalSeconds);
      handleLeftWin();
      resetButtons();
      sessionStorage.clear();
    }
  }

  // Right button click handler
  function rightButtonClicked() {
    leftButtonClicks = 0;
    rightButtonClicks++;

    if (rightButtonClicks === 1) {
      // First click on right button
      console.log(
        "Right button clicked (1st time). Changing text to 'Confirm'."
      );
      document.getElementById("rightButton").textContent = "Confirm";
      document.getElementById("leftButton").textContent = "WON"; // Reset left button text
    } else if (rightButtonClicks === 2) {
      // Second click on right button
      console.log("Right button clicked (2nd time). Redirecting...");
      // Perform the redirect action for right button
      var matchDurationElement = document.getElementById("match-duration");
      var duration = matchDurationElement.textContent;

      var totalSeconds = convertDurationToSeconds(duration);
      console.log("Match Duration (seconds):", totalSeconds);
      handleRightWin();
      resetButtons();
      sessionStorage.clear();
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
    document.getElementById("leftButton").textContent = "WON"; // Reset left button text
    document.getElementById("rightButton").textContent = "WON"; // Reset right button text
  }

  // Example usage:
  // Assuming you have HTML buttons with ids "leftButton" and "rightButton"
  document
    .getElementById("leftButton")
    .addEventListener("click", leftButtonClicked);
  document
    .getElementById("rightButton")
    .addEventListener("click", rightButtonClicked);
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  function handleLeftWin() {
    if (localStorage.getItem("buttonClicked")) {
      return;
    }
    // ====================================================================================== LEFT WON
    const leftRatingElement2 = document.getElementsByClassName("rating1")[0];
    const leftMMRElement = leftRatingElement2.querySelector("#leftMMR");
    const rightRatingElement2 = document.getElementsByClassName("rating2")[0];
    const rightMMRElement = rightRatingElement2.querySelector("#rightMMR");
    leftRatingValue = leftMMRElement.textContent;
    rightRatingValue = rightMMRElement.textContent;

    var expected_score =
      1 /
      (1 + Math.pow(10, Math.abs(leftRatingValue - rightRatingValue) / 300));
    K = 50;
    console.log("========================================================");
    left_mmr = parseInt(leftRatingValue);
    right_mmr = parseInt(rightRatingValue);
    console.log("left_mmr: ", left_mmr);
    console.log("right_mmr: ", right_mmr);

    left_new_mmr = leftRatingValue;
    right_new_mmr = rightRatingValue;

    if (left_mmr > right_mmr) {
      var shift = Math.round(K * (0 - expected_score));
      var left_new_mmr = Math.round(left_mmr - shift);
      var right_new_mmr = Math.round(right_mmr + shift);
      console.log("CHECK 1");
    } else {
      var shift = Math.round(K * (1 - expected_score));
      var left_new_mmr = Math.round(left_mmr + shift);
      var right_new_mmr = Math.round(right_mmr - shift);
      console.log("CHECK 2");
    }

    console.log("shift = ", Math.abs(shift));
    console.log("left_new_mmr: ", left_new_mmr);
    console.log("right_new_mmr: ", right_new_mmr);

    // \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

    var playerNameElementLeft = document.getElementById("playerName1");
    var leftName = playerNameElementLeft.textContent;

    var playerNameElementRight = document.getElementById("playerName2");
    var rightName = playerNameElementRight.textContent;

    var data = {
      leftName: leftName,
      left_new_mmr: left_new_mmr,
      rightName: rightName,
      right_new_mmr: right_new_mmr,
    };

    fetch("/process-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((responseData) => {
        // Process the response data received from the server
        console.log(responseData);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    // +++++++++++++++++++++++++++++++++++++++++ DATABASE STUFF

    var matchDurationElement = document.getElementById("match-duration");
    var duration = matchDurationElement.textContent;
    var totalSeconds = convertDurationToSeconds(duration);
    var currentTimestamp = new Date().toISOString();

    playerLeftWinData = {
      playerLeft: leftName,
      playerRight: rightName,
      winner: leftName,
      loser: rightName,
      timestamp: currentTimestamp,
      duration: totalSeconds,
      shift: Math.abs(shift),
      left_mmr: left_mmr,
      right_mmr: right_mmr,
    };

    fetch("/leftWonProcess", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playerLeftWinData),
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // +++++++++++++++++++++++++++++++++++++++++ DATABASE STUFF

    //
    // HERE
    //
    // ====================================================================================== LEFT WON
    localStorage.setItem("buttonClicked", true);
    setTimeout(function () {
      window.location.href = "/matchmaking/match/processing/calculate";
    }, 1000); // 1000 milliseconds = 1 second
  }

  function handleRightWin() {
    if (localStorage.getItem("buttonClicked")) {
      return;
    }
    // ====================================================================================== RIGHT WON
    const leftRatingElement2 = document.getElementsByClassName("rating1")[0];
    const leftMMRElement = leftRatingElement2.querySelector("#leftMMR");
    const rightRatingElement2 = document.getElementsByClassName("rating2")[0];
    const rightMMRElement = rightRatingElement2.querySelector("#rightMMR");
    leftRatingValue = leftMMRElement.textContent;
    rightRatingValue = rightMMRElement.textContent;
    // 300 orig

    var expected_score =
      1 /
      (1 + Math.pow(10, Math.abs(leftRatingValue - rightRatingValue) / 300));
    K = 50;
    console.log("========================================================");
    left_mmr = parseInt(leftRatingValue);
    right_mmr = parseInt(rightRatingValue);
    console.log("left_mmr: ", left_mmr);
    console.log("right_mmr: ", right_mmr);

    left_new_mmr = leftRatingValue;
    right_new_mmr = rightRatingValue;

    if (left_mmr < right_mmr) {
      var shift = Math.round(K * (0 - expected_score));
      var left_new_mmr = Math.round(left_mmr + shift);
      var right_new_mmr = Math.round(right_mmr - shift);
      console.log("CHECK 1");
    } else {
      var shift = Math.round(K * (1 - expected_score));
      var left_new_mmr = Math.round(left_mmr - shift);
      var right_new_mmr = Math.round(right_mmr + shift);
      console.log("CHECK 2");
    }

    console.log("shift = ", Math.abs(shift));
    console.log("left_new_mmr: ", left_new_mmr);
    console.log("right_new_mmr: ", right_new_mmr);

    // \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

    var playerNameElementLeft = document.getElementById("playerName1");
    var leftName = playerNameElementLeft.textContent;

    var playerNameElementRight = document.getElementById("playerName2");
    var rightName = playerNameElementRight.textContent;

    var data = {
      leftName: leftName,
      left_new_mmr: left_new_mmr,
      rightName: rightName,
      right_new_mmr: right_new_mmr,
    };

    fetch("/process-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((responseData) => {
        // Process the response data received from the server
        console.log(responseData);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    // +++++++++++++++++++++++++++++++++++++++++ DATABASE STUFF

    var matchDurationElement = document.getElementById("match-duration");
    var duration = matchDurationElement.textContent;
    var totalSeconds = convertDurationToSeconds(duration);
    var currentTimestamp = new Date().toISOString();

    playerLeftWinData = {
      playerLeft: leftName,
      playerRight: rightName,
      winner: rightName,
      loser: leftName,
      timestamp: currentTimestamp,
      duration: totalSeconds,
      shift: Math.abs(shift),
      left_mmr: left_mmr,
      right_mmr: right_mmr,
    };

    fetch("/rightWonProcess", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playerLeftWinData),
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // +++++++++++++++++++++++++++++++++++++++++ DATABASE STUFF

    // ====================================================================================== RIGHT WON
    localStorage.setItem("buttonClicked", true);
    setTimeout(function () {
      window.location.href = "/matchmaking/match/processing/calculate";
    }, 1000); // 1000 milliseconds = 1 second
  }
});









var data; // Declare the global data variable

var socket = io(); // Connect to the server that serves this HTML page



socket.on("connect", function () {
  console.log("Connected to WebSocket server");

  // Send a request for match status when connected (optional)
  socket.emit("request_match_status");


});

socket.on("disconnect", function () {
  console.log("Disconnected from WebSocket server");
  
});

// Handle the "match_status" event sent by the server
socket.on("match_status", function (match_data) {
  // Handle the received match data
  console.log("Received match status:", match_data);

  // Update the user interface with the received match data
  // document.getElementById('status').innerText = match_data.status;
  document.getElementById("leftNAME").innerText = match_data.nameLeft;
  document.getElementById("rightNAME").innerText = match_data.nameRight;
  document.getElementById("leftMMR").innerText = match_data.mmrLeft;
  document.getElementById("rightMMR").innerText = match_data.mmrRight;
  document.getElementById("leftWINRATE").innerText = match_data.winrateLeft;
  document.getElementById("rightWINRATE").innerText = match_data.winrateRight;
  // document.getElementById('date').innerText = match_data.date;

  // Update the global data variable
  data = {
    status: match_data.status,
    nameLeft: match_data.nameLeft,
    nameRight: match_data.nameRight,
    mmrLeft: match_data.mmrLeft,
    mmrRight: match_data.mmrRight,
    date: match_data.date,
    winrateLeft: match_data.winrateLeft,
    winrateRight: match_data.winrateRight
  };



  


  //===================




  updateData(data);


  const leftName = data.nameLeft;
  const rightName = data.nameRight;

  fetchAvatar(leftName, '1vsImg');
  fetchAvatar(rightName, '2vsImg');


  // Update the start timestamp only if it's not null or undefined
  if (data.date !== null && data.date !== undefined) {

    startTimestamp = new Date(data.date);
  }





  //====================
});

function updateData(data) {
  // console.log("NEW DATA: ", data);
  // Check if the status is "Idle"
  
  if (data.status === "Idle") {
    document.getElementById("match-container").style.display = "none";
    const containerTimerElement = document.querySelector(".containerTimer");
    const cancelBtn = document.querySelector("bottomPart fade-in");
    if (containerTimerElement) {
      containerTimerElement.style.display = "none";
    }
    if (cancelBtn) {
      cancelBtn.stlye.display = "none";
    }
    const displayField = document.querySelector(".playerIdle");
    displayField.style.display = "flex";

    // Display a message or update the UI to indicate there is no ongoing match
    const noMatchMessage = "There is no currently ongoing match.";
    const noMatchElement = document.createElement("div");
    noMatchElement.textContent = noMatchMessage;
    const matchInfoElement = document.getElementById("matchInfo");
    matchInfoElement.innerHTML = "";
    matchInfoElement.appendChild(noMatchElement);
  } 
  else {
    // Unhide the elements when the status is not "Idle"
    document.getElementById("match-container").style.display = "flex";
    const containerTimerElement = document.querySelector(".containerTimer");
    const cancelBtn = document.querySelector("bottomPart fade-in");
    if (containerTimerElement) {
      containerTimerElement.style.display = "flex";
    }
    if (cancelBtn) {
      cancelBtn.stlye.display = "flex";
    }
    const displayField = document.querySelector(".playerIdle");
    displayField.style.display = "none";
    // Update left side data
    if (data.nameLeft !== null && data.nameLeft !== undefined) {
      document.getElementById("leftNAME").textContent = data.nameLeft;
    } else {
      document.getElementById("leftNAME").textContent = "N/A";
    }

    if (data.mmrLeft !== null && data.mmrLeft !== undefined) {
      document.getElementById("leftMMR").textContent = data.mmrLeft;
    } else {
      document.getElementById("leftMMR").textContent = "N/A";
    }

    if (data.winrateLeft !== null && data.winrateLeft !== undefined) {
      document.getElementById("leftWINRATE").textContent = data.winrateLeft;
    } else {
      document.getElementById("leftWINRATE").textContent = "N/A";
    }

    // Update right side data
    if (data.nameRight !== null && data.nameRight !== undefined) {
      document.getElementById("rightNAME").textContent = data.nameRight;
    } else {
      document.getElementById("rightNAME").textContent = "N/A";
    }

    if (data.mmrRight !== null && data.mmrRight !== undefined) {
      document.getElementById("rightMMR").textContent = data.mmrRight;
    } else {
      document.getElementById("rightMMR").textContent = "N/A";
    }

    if (data.winrateRight !== null && data.winrateRight !== undefined) {
      document.getElementById("rightWINRATE").textContent = data.winrateRight;
    } else {
      document.getElementById("rightWINRATE").textContent = "N/A";
    }
  }
}








// // Function to fetch and update match status
// function updateMatchStatus() {
  // socket.emit("request_match_status");
// }

// // Initially, call the function to fetch and display match status
// updateMatchStatus();

// // Set up an interval to periodically fetch and display match status every 2 seconds
// setInterval(updateMatchStatus, 5000); // 2000 milliseconds = 2 seconds



document.addEventListener("DOMContentLoaded", function () {
  
  const maxAttempts = 10; // Maximum number of attempts
  let attempts = 0;

  function tryAccessElements() {
    console.log("try to fetch data: ", attempts);
    // Check if the maximum number of attempts has been reached
    if (attempts >= maxAttempts) {
      console.error("Failed to access elements after multiple attempts.");
      return;
    }

    var leftRatingElement = document.querySelector(".rating1");
    var leftRatingValue = leftRatingElement
      ? leftRatingElement.textContent.trim().match(/\d+/)
      : "";

    var rightRatingElement = document.querySelector(".rating2");
    var rightRatingValue = rightRatingElement
      ? rightRatingElement.textContent.trim().match(/\d+/)
      : "";

    // Check if both elements are successfully accessed
    if (leftRatingValue && rightRatingValue) {
      // Your existing code that depends on leftRatingValue and rightRatingValue
      left_mmr = parseInt(leftRatingValue[0]);
      right_mmr = parseInt(rightRatingValue[0]);

      // ===================win left
      var expected_score_left =
        1 /
        (1 +
          Math.pow(
            10,
            Math.abs(leftRatingValue[0] - rightRatingValue[0]) / 300
          ));
      K = 50;
      if (left_mmr < right_mmr) {
        var shift_left = Math.abs(Math.round(K * (1 - expected_score_left)));
      } else {
        var shift_left = Math.abs(Math.round(K * (0 - expected_score_left)));
      }

      // console.log("SHIFTTTTT left win: ", shift_left)
      // ===================win left

      // // ===================win right
      var expected_score_right =
        1 /
        (1 +
          Math.pow(
            10,
            Math.abs(leftRatingValue[0] - rightRatingValue[0]) / 300
          ));
      K = 50;
      if (left_mmr > right_mmr) {
        var shift_right = Math.abs(Math.round(K * (1 - expected_score_right)));
      } else {
        var shift_right = Math.abs(Math.round(K * (0 - expected_score_right)));
      }
      // // ===================win right

      var newMMRwin1 = document.querySelector(".newMMRwin1");
      newMMRwin1.innerHTML = `<p>Win case:</p> <span>+${shift_left}</span>`;

      var newMMRlose1 = document.querySelector(".newMMRlose1");
      newMMRlose1.innerHTML = `<p>Lose case:</p> <span>-${shift_right}</span>`;

      var newMMRwin2 = document.querySelector(".newMMRwin2");
      newMMRwin2.innerHTML = `<p>Win case:</p> <span>+${shift_right}</span>`;

      var newMMRlose2 = document.querySelector(".newMMRlose2");
      newMMRlose2.innerHTML = `<p>Lose case:</p> <span>-${shift_left}</span>`;

      // ================================================================

      // const leftName = document.getElementById("playerName1").textContent;
      // const rightName = document.getElementById("playerName2").textContent;

      // fetch("/left-avatar", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/x-www-form-urlencoded",
      //   },
      //   body: `name=${leftName}`,
      // })
      //   .then((response) => response.json())
      //   .then((data) => {
      //     if (data.error) {
      //       console.error(data.error);
      //       setDefaultAvatar("1vsImg");
      //     } else {
      //       const avatarUrl = data.avatar_url;
      //       const avatarImage = document.getElementById("1vsImg");
      //       avatarImage.src = avatarUrl;
      //     }
      //   })
      //   .catch((error) => {
      //     console.error(error);
      //     setDefaultAvatar("1vsImg");
      //   });

      // fetch("/avatar", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/x-www-form-urlencoded",
      //   },
      //   body: `name=${rightName}`,
      // })
      //   .then((response) => response.json())
      //   .then((data) => {
      //     if (data.error) {
      //       console.error(data.error);
      //       setDefaultAvatar("2vsImg");
      //     } else {
      //       const avatarUrl = data.avatar_url;
      //       const avatarImage = document.getElementById("2vsImg");
      //       avatarImage.src = avatarUrl;
      //     }
      //   })
      //   .catch((error) => {
      //     console.error(error);
      //     setDefaultAvatar("2vsImg");
      //   });

      // function setDefaultAvatar(imageId) {
      //   const defaultImageUrl =
      //     "https://my.catgirls.forsale/QukeB047.png"; // Replace with your default image URL
      //   const avatarImage = document.getElementById(imageId);
      //   avatarImage.src = defaultImageUrl;
      // }
    } else {
      // If one or both elements are not available yet, retry after a short delay
      attempts++;
      setTimeout(tryAccessElements, 1000); // Retry after 1 second
    }
  }

  // Start the initial attempt to access elements
  tryAccessElements();
});

// var backgroundImage = document.querySelector(".background-image");

// document.addEventListener("mousemove", function (event) {
//   var mouseX = event.clientX;
//   var mouseY = event.clientY;

//   var percentX = (mouseX / window.innerWidth) * 10;
//   var percentY = (mouseY / window.innerHeight) * 300;

//   backgroundImage.style.backgroundPosition = percentX + "% " + percentY + "%";
// });

// Get the element where you want to display the match duration
const matchDurationElement = document.getElementById("match-duration");

// Start time of the match
const startTime = new Date();

// Update the match duration every second
console.log("UpdateDuration Call 1")
setInterval(updateMatchDuration, 1000);


function padZero(number) {
  return number.toString().padStart(2, "0");
}

function goBack() {
  history.back();
}

// Function to handle SSE events
// function handleSSE(event) {
//   console.log('Received SSE event:', event);
//   if (event.type === 'match_status') {
//     const eventData = JSON.parse(event.data);
//     console.log('Parsed event data:', eventData);

//     // Update the match status element with the new status
//     const matchStatusElement = document.getElementById('matchStatus');
//     matchStatusElement.innerText = eventData.status;

//     if (eventData.status === 'Ongoing') {
//       // If the match status is "Ongoing," update the player details
//       const nameLeftElement = document.getElementById('playerName1');
//       const mmrLeftElement = document.querySelector('.rating1');
//       const winrateLeftElement = document.getElementById('winrateLeft');
//       const nameRightElement = document.getElementById('playerName2');
//       const mmrRightElement = document.querySelector('.rating2');
//       const winrateRightElement = document.getElementById('winrateRight');

//       // Update the elements with the new data
//       nameLeftElement.innerText = eventData.nameLeft;
//       mmrLeftElement.innerText = `(${eventData.mmrLeft})`;
//       winrateLeftElement.innerText = eventData.winrateLeft;
//       nameRightElement.innerText = eventData.nameRight;
//       mmrRightElement.innerText = `(${eventData.mmrRight})`;
//       winrateRightElement.innerText = eventData.winrateRight;

//       // You can also show or hide buttons based on the match status if needed.
//       // For example:
//       const leftButton = document.getElementById('leftButton');
//       const rightButton = document.getElementById('rightButton');
//       leftButton.style.display = 'block';
//       rightButton.style.display = 'block';
//     } else {
//       // If the match status is not "Ongoing," show a different UI or message
//       const nameLeftElement = document.getElementById('playerName1');
//       const mmrLeftElement = document.querySelector('.rating1');
//       const winrateLeftElement = document.getElementById('winrateLeft');
//       const nameRightElement = document.getElementById('playerName2');
//       const mmrRightElement = document.querySelector('.rating2');
//       const winrateRightElement = document.getElementById('winrateRight');

//       // Clear the player details when there is no ongoing match
//       nameLeftElement.innerText = '';
//       mmrLeftElement.innerText = '';
//       winrateLeftElement.innerText = '';
//       nameRightElement.innerText = '';
//       mmrRightElement.innerText = '';
//       winrateRightElement.innerText = '';

//       // You can also show or hide buttons based on the match status if needed.
//       // For example:
//       const leftButton = document.getElementById('leftButton');
//       const rightButton = document.getElementById('rightButton');
//       leftButton.style.display = 'none';
//       rightButton.style.display = 'none';
//     }
//   }

// }

// // Connect to the SSE endpoint
// const eventSource = new EventSource('/sse-match-status');

// // Listen for SSE events and handle them using the handleSSE function
// eventSource.onmessage = handleSSE;

// eventSource.onerror = function(event) {
//   console.error('SSE Error:', event);
// };

// // Add event listener to close the SSE connection when the page is being unloaded
// window.addEventListener('beforeunload', function () {
//   eventSource.close();
// });

let animationTriggered = false;

// Function to update the data in the HTML page




// Get the element with the class "profile-username"
const profileUsernameElement = document.querySelector(".profile-username");

// Check if the element exists
if (profileUsernameElement) {
  // Get the text content of the element (which is "testAccount" in this case)
  const username = profileUsernameElement.textContent;
  console.log("Username:", username);
  fetchAvatar(username, "profilePic");
} else {
  console.log('Element with class "profile-username" not found.');
}
// Update the match duration every second
console.log("UpdateDuration Call 2")
setInterval(updateMatchDuration, 1000);


  // Initialize a variable to store the start timestamp received from SSE
  let startTimestamp;





function updateMatchDuration() {
  if (!startTimestamp) return; // Don't update if startTimestamp is not available

  // Current time
  const currentTime = new Date();

  // Calculate the elapsed time in milliseconds
  const elapsedTime = currentTime - startTimestamp;

  // Convert elapsed time to hours, minutes, and seconds
  const hours = Math.floor(elapsedTime / 3600000);
  const minutes = Math.floor((elapsedTime % 3600000) / 60000);
  const seconds = Math.floor((elapsedTime % 60000) / 1000);

  // Function to format time with leading zeros
  function padZero(num) {
    return num.toString().padStart(2, "0");
  }

  // Format the time with leading zeros
  const formattedTime = `${padZero(hours)}:${padZero(minutes)}:${padZero(
    seconds
  )}`;

  // Update the match duration element
  const matchDurationElement = document.getElementById("match-duration");
  matchDurationElement.textContent = formattedTime;
}

function fetchAvatar(name, imageId) {
  fetch(`/left-avatar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `name=${name}`,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        // console.error(data.error);
        setDefaultAvatar(imageId);
      } else {
        const avatarUrl = data.avatar_url;
        const avatarImage = document.getElementById(imageId);
        avatarImage.src = avatarUrl;
      }
    })
    .catch((error) => {
      console.error(error);
      setDefaultAvatar(imageId);
    });
}

function setDefaultAvatar(imageId) {
  const defaultImageUrl = "https://my.catgirls.forsale/QukeB047.png"; // Replace with your default image URL
  const avatarImage = document.getElementById(imageId);
  avatarImage.src = defaultImageUrl;
}

var homeBtn = document.getElementById("homeT");
homeBtn.addEventListener("click", function () {
  history.back();
});

// function showBigNumber(winAmount) {
//   const numberContainer = document.createElement("div");
//   numberContainer.classList.add("number-container");

//   const bigNumber = document.createElement("span");
//   bigNumber.classList.add("big-number");
//   bigNumber.textContent = "0";

//   numberContainer.appendChild(bigNumber);
//   document.body.appendChild(numberContainer);

//   setTimeout(() => {
//     numberContainer.classList.add("visible");
//     animateNumber(bigNumber, 0, winAmount, 1000); // Animating number from 0 to winAmount
//   }, 200); // Delay before showing the big number
// }

// function animateNumber(element, start, end, duration) {
//   const startTime = new Date().getTime();
//   const interval = setInterval(() => {
//     const currentTime = new Date().getTime();
//     const elapsedTime = currentTime - startTime;

//     if (elapsedTime >= duration) {
//       clearInterval(interval);
//       element.textContent = end;
//       setTimeout(() => {
//         // Here, you can put the code to hide the match container
//         document.getElementById("match-container").style.display = "none";
//       }, 1000); // Delay before hiding the match container
//     } else {
//       const progress = (elapsedTime / duration);
//       const currentValue = Math.round(start + (end - start) * progress);
//       element.textContent = currentValue;
//     }
//   }, 30); // Interval for animation
// }
