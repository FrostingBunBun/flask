window.addEventListener('load', function() {
  var leftGaugeElement = document.getElementById('leftGauge');
  leftGaugeElement.classList.add('fade-in');
  
  var rightGaugeElement = document.getElementById('rightGauge');
  rightGaugeElement.classList.add('fade-in');
});
window.addEventListener('load', function() {
  var bottomPartElement = document.querySelector('.bottomPart');
  bottomPartElement.classList.add('fade-in');
});




document.addEventListener("DOMContentLoaded", function () {

    
    function calculateWinProbabilities(leftRating, rightRating, leftWinrate, rightWinrate) {
        if (leftWinrate < 0 || leftWinrate > 1 || rightWinrate < 0 || rightWinrate > 1) {
          throw new Error('Win rates should be between 0 and 1 (inclusive).');
        }
      
        leftRating = parseFloat(leftRating);
        rightRating = parseFloat(rightRating);
        leftWinrate = parseFloat(leftWinrate);
        rightWinrate = parseFloat(rightWinrate);
      
        console.log("leftRating: ", leftRating);
        console.log("rightRating: ", rightRating);
        console.log("leftWinrate: ", leftWinrate);
        console.log("rightWinrate: ", rightWinrate);
      
        // Introduce a scaling factor to amplify the effect of win rate
        var winRateScalingFactor = 2; // Adjust this factor as desired
      
        // Calculate win probabilities based on the weighted average of ratings and win rates
        var leftProbability = leftRating * (leftWinrate ** winRateScalingFactor);
        var rightProbability = rightRating * (rightWinrate ** winRateScalingFactor);
      
        // Normalize probabilities to ensure they sum up to 1
        var sumProbabilities = (leftProbability + rightProbability);
        var normalizedLeftProbability = leftProbability / sumProbabilities;
        var normalizedRightProbability = rightProbability / sumProbabilities;
        console.log("sumProbabilities: ", sumProbabilities);
        console.log("normalizedLeftProbability: ", normalizedLeftProbability);
        console.log("normalizedRightProbability: ", normalizedRightProbability);
      
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
  var leftRatingValue = leftRatingElement ? leftRatingElement.textContent.trim().match(/\d+/) : "";
  console.log("left Rating value:", leftRatingValue);
  
  var rightRatingElement = document.querySelector('.rating2');
  var rightRatingValue = rightRatingElement ? rightRatingElement.textContent.trim().match(/\d+/) : "";

  
  var leftWinrateElement = document.querySelector(".additionalNumber1");
  var leftWinrateValue = leftWinrateElement ? leftWinrateElement.textContent.trim().replace("Winrate: ", "") : "";
  console.log("left Winrate value:", leftWinrateValue);
  
  var rightWinrateElement = document.querySelector(".additionalNumber2");
  var rightWinrateValue = rightWinrateElement ? rightWinrateElement.textContent.trim().replace("Winrate: ", "") : "";
  console.log("right Winrate value:", rightWinrateValue);
  

  var [rightProbability, leftProbability] = calculateWinProbabilities(leftRatingValue, rightRatingValue, leftWinrateValue, rightWinrateValue);



  
    // console.log("Left player's probability of winning:", leftProbability);
    // console.log("Right player's probability of winning:", rightProbability);

    var percentageLeft = (leftProbability * 100).toFixed(2) + "%";
    var percentageRight = (rightProbability * 100).toFixed(2) + "%";

    var leftPercentElement = document.getElementById("leftGauge");
    leftPercentElement.textContent = percentageLeft

    var rightPercentElement = document.getElementById("rightGauge");
    rightPercentElement.textContent = percentageRight


  // Example usage: update the gauge with values 60 and 40
  updateGauge(leftProbability, rightProbability);
});
