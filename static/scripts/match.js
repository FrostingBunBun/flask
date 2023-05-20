window.addEventListener("load", function () {
  var leftGaugeElement = document.getElementById("leftGauge");
  leftGaugeElement.classList.add("fade-in");

  var rightGaugeElement = document.getElementById("rightGauge");
  rightGaugeElement.classList.add("fade-in");
});
window.addEventListener("load", function () {
  var bottomPartElement = document.querySelector(".bottomPart");
  bottomPartElement.classList.add("fade-in");
});

document.addEventListener("DOMContentLoaded", function () {
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
    window.location.href = "/matchmaking";
  });

  var refreshFlag = sessionStorage.getItem("refreshFlag");

  if (refreshFlag !== "true") {
    // Set the session variable to indicate that refresh has been triggered
    sessionStorage.setItem("refreshFlag", "true");

    // Perform the page refresh
    window.location.reload();
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

  var [rightProbability, leftProbability] = calculateWinProbabilities(
    leftRatingValue,
    rightRatingValue,
    leftWinrateValue,
    rightWinrateValue
  );

  // console.log("Left player's probability of winning:", leftProbability);
  // console.log("Right player's probability of winning:", rightProbability);

  var percentageLeft = (leftProbability * 100).toFixed(2) + "%";
  var percentageRight = (rightProbability * 100).toFixed(2) + "%";

  var leftPercentElement = document.getElementById("leftGauge");
  leftPercentElement.textContent = percentageLeft;

  var rightPercentElement = document.getElementById("rightGauge");
  rightPercentElement.textContent = percentageRight;

  // Example usage: update the gauge with values 60 and 40
  updateGauge(leftProbability, rightProbability);




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
      console.log("Left button clicked (1st time). Changing text to 'Confirm'.");
      document.getElementById("leftButton").textContent = "Confirm";
      document.getElementById("rightButton").textContent = "WON"; // Reset left button text
    } else if (leftButtonClicks === 2) {
      // Second click on left button
      console.log("Left button clicked (2nd time). Redirecting...");
      // Perform the redirect action for left button
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
      console.log("Right button clicked (1st time). Changing text to 'Confirm'.");
      document.getElementById("rightButton").textContent = "Confirm";
      document.getElementById("leftButton").textContent = "WON"; // Reset left button text
    } else if (rightButtonClicks === 2) {
      // Second click on right button
      console.log("Right button clicked (2nd time). Redirecting...");
      // Perform the redirect action for right button
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
  document.getElementById("leftButton").addEventListener("click", leftButtonClicked);
  document.getElementById("rightButton").addEventListener("click", rightButtonClicked);
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  function handleLeftWin() {
    // ====================================================================================== LEFT WON

    var expected_score =
      1 /
      (1 +
        Math.pow(
          10,
          Math.abs(leftRatingValue[0] - rightRatingValue[0]) / 400
        ));
    K = 50;
    console.log("========================================================")
    left_mmr = parseInt(leftRatingValue[0]);
    right_mmr = parseInt(rightRatingValue[0]);
    console.log("left_mmr: ", left_mmr);
    console.log("right_mmr: ", right_mmr);

    left_new_mmr = leftRatingValue[0];
    right_new_mmr = rightRatingValue[0];

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
      right_new_mmr: right_new_mmr
    };

    fetch('/process-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(responseData => {
        // Process the response data received from the server
        console.log(responseData);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    // \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

    // ====================================================================================== LEFT WON
    window.location.href = "/matchmaking/match/processing/calculate";
  }


  function handleRightWin() {
    // ====================================================================================== RIGHT WON

    var expected_score =
      1 /
      (1 +
        Math.pow(
          10,
          Math.abs(leftRatingValue[0] - rightRatingValue[0]) / 400
        ));
    K = 50;
    console.log("========================================================")
    left_mmr = parseInt(leftRatingValue[0]);
    right_mmr = parseInt(rightRatingValue[0]);
    console.log("left_mmr: ", left_mmr);
    console.log("right_mmr: ", right_mmr);

    left_new_mmr = leftRatingValue[0];
    right_new_mmr = rightRatingValue[0];

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
      right_new_mmr: right_new_mmr
    };

    fetch('/process-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(responseData => {
        // Process the response data received from the server
        console.log(responseData);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    // \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

    // ====================================================================================== RIGHT WON
    window.location.href = "/matchmaking/match/processing/calculate";
  }




});

document.addEventListener("DOMContentLoaded", function () {


  var leftRatingElement = document.querySelector(".rating1");
  var leftRatingValue = leftRatingElement ? leftRatingElement.textContent.trim().match(/\d+/) : "";

  var rightRatingElement = document.querySelector(".rating2");
  var rightRatingValue = rightRatingElement ? rightRatingElement.textContent.trim().match(/\d+/) : "";

  left_mmr = parseInt(leftRatingValue[0]);
  right_mmr = parseInt(rightRatingValue[0]);

  // // session.pop('leftMMR', None)
  // //   session.pop('leftNAME', None)
  // //   session.pop('leftWINRATE', None)
  // //   session.pop('rightNAME', None)
  // //   session.pop('rightMMR', None)
  // //   session.pop('rightWINRATE', None)
  // console.log("BEFORE SESSION", sessionStorage);
  // sessionStorage.removeItem('leftMMR');
  // sessionStorage.removeItem('leftNAME');
  // sessionStorage.removeItem('leftWINRATE');
  // sessionStorage.removeItem('rightNAME');
  // sessionStorage.removeItem('rightMMR');
  // sessionStorage.removeItem('rightWINRATE');
  // console.log("AFTER SESSION", sessionStorage)


  // ===================win left
  var expected_score_left =
    1 /
    (1 +
      Math.pow(10, Math.abs(leftRatingValue[0] - rightRatingValue[0]) / 400));
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
      Math.pow(10, Math.abs(leftRatingValue[0] - rightRatingValue[0]) / 400));
  K = 50;
  if (left_mmr > right_mmr) {
    var shift_right = Math.abs(Math.round(K * (1 - expected_score_right)));
  } else {
    var shift_right = Math.abs(Math.round(K * (0 - expected_score_right)));
  }
  // console.log("SHIFTTTTT right win: ", shift_right)
  // // ===================win right

  var newMMRwin1 = document.querySelector('.newMMRwin1');
  newMMRwin1.innerHTML = "win case: +" + shift_left;

  var newMMRlose1 = document.querySelector(".newMMRlose1");
  newMMRlose1.innerHTML = "lose case: -" + shift_right;

  var newMMRwin2 = document.querySelector(".newMMRwin2");
  newMMRwin2.innerHTML = "win case: +" + shift_right;

  var newMMRlose2 = document.querySelector(".newMMRlose2");
  newMMRlose2.innerHTML = "lose case: -" + shift_left;

  // ================================================================




  const leftName = document.getElementById("playerName1").textContent;
  const rightName = document.getElementById("playerName2").textContent;

  fetch("/left-avatar", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `name=${leftName}`,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.error(data.error);
        setDefaultAvatar("1vsImg");
      } else {
        // console.log("DAAAAAAAAAAAA BLIAT")
        const avatarUrl = data.avatar_url;
        const avatarImage = document.getElementById("1vsImg");
        avatarImage.src = avatarUrl;
      }
    })
    .catch((error) => {
      console.error(error);
      setDefaultAvatar("1vsImg");
    });

  fetch("/avatar", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `name=${rightName}`,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.error(data.error);
        setDefaultAvatar("2vsImg");
      } else {
        const avatarUrl = data.avatar_url;
        const avatarImage = document.getElementById("2vsImg");
        avatarImage.src = avatarUrl;
      }
    })
    .catch((error) => {
      console.error(error);
      setDefaultAvatar("2vsImg");
    });





  function setDefaultAvatar(imageId) {
    const defaultImageUrl = "https://my.catgirls.forsale/QukeB047.png"; // Replace with your default image URL
    const avatarImage = document.getElementById(imageId);
    avatarImage.src = defaultImageUrl;
  }
});

// if (!sessionStorage.getItem('pageReloaded')) {
//   setTimeout(function() {
//   sessionStorage.setItem('pageReloaded', 'true');
//   location.reload(); // Reload the page
// }, 400);
// }