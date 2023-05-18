document.addEventListener("DOMContentLoaded", function () {

    
    function calculateWinProbabilities(leftRating, rightRating, leftWinrate, rightWinrate) {
        if (leftWinrate < 0 || leftWinrate > 1 || rightWinrate < 0 || rightWinrate > 1) {
          throw new Error('Win rates should be between 0 and 1 (inclusive).');
        }
        leftRating = parseFloat(leftRating);
        rightRating = parseFloat(rightRating);
        leftWinrate = parseFloat(leftWinrate);
        rightWinrate = parseFloat(rightWinrate);
      
        var leftProbability = 1 / (1 + Math.pow(10, (rightRating - leftRating)  * leftWinrate / 1.5 / 400))
        var rightProbability = 1 / (1 + Math.pow(10, (leftRating - rightRating) * rightWinrate / 1.5 / 400))
      
        var normalizedLeftProbability = leftProbability;
        var normalizedRightProbability = rightProbability;
      
        return [normalizedLeftProbability, normalizedRightProbability];
      }
      
      
      
// leftRating = parseFloat(leftRating);
// rightRating = parseFloat(rightRating);
// leftWinrate = parseFloat(leftWinrate);
// rightWinrate = parseFloat(rightWinrate);

// console.log("type leftRating: ", typeof leftRating);
// console.log("type rightRating: ", typeof rightRating);
// console.log("type leftWinrate: ", typeof leftWinrate);
// console.log("type rightWinrate: ", typeof rightWinrate);
      
      
      
      
      
      


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
  var leftRatingValue = leftRatingElement ? leftRatingElement.textContent.trim() : "";
  console.log("left Rating value:", leftRatingValue);
  
  var rightRatingElement = document.querySelector(".rating2");
  var rightRatingValue = rightRatingElement ? rightRatingElement.textContent.trim() : "";
  console.log("right Rating value:", rightRatingValue);
  
  var leftWinrateElement = document.querySelector(".additionalNumber1");
  var leftWinrateValue = leftWinrateElement ? leftWinrateElement.textContent.trim() : "";
  console.log("left Winrate value:", leftWinrateValue);
  
  var rightWinrateElement = document.querySelector(".additionalNumber2");
  var rightWinrateValue = rightWinrateElement ? rightWinrateElement.textContent.trim() : "";
  console.log("right Winrate value:", rightWinrateValue);
  

  var [rightProbability, leftProbability] = calculateWinProbabilities(leftRatingValue, rightRatingValue, leftWinrateValue, rightWinrateValue);



  
    console.log("Left player's probability of winning:", leftProbability);
    console.log("Right player's probability of winning:", rightProbability);

    var percentageLeft = (leftProbability * 100).toFixed(2) + "%";
    var percentageRight = (rightProbability * 100).toFixed(2) + "%";

    var leftPercentElement = document.getElementById("leftGauge");
    leftPercentElement.textContent = percentageLeft

    var rightPercentElement = document.getElementById("rightGauge");
    rightPercentElement.textContent = percentageRight


  // Example usage: update the gauge with values 60 and 40
  updateGauge(leftProbability, rightProbability);
});
