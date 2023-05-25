function calculateWinProbabilities(
  leftRating,
  rightRating,
  leftWinrate,
  rightWinrate
) {
  if (leftRating !== null && typeof leftRating !== 'undefined') {
    leftRating = leftRating[1];
  }
  
  if (rightRating !== null && typeof rightRating !== 'undefined') {
    rightRating = rightRating[1];
  }
 
  
  // console.log("leftRating: ", leftRating)
  // console.log("rightRating: ", rightRating)
  // console.log("leftWinrate: ", leftWinrate)
  // console.log("rightWinrate: ", rightWinrate)
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
  // console.log("normalizedRightProbability: ", normalizedRightProbability)
  // console.log("normalizedLeftProbability: ", normalizedLeftProbability)

  return [normalizedRightProbability, normalizedLeftProbability];
}



function updateGauge(value1, value2) {
  var fill1 = document.getElementById("fill1");
  var fill2 = document.getElementById("fill2");


  // console.log("fill1: ", fill1)
  // console.log("fill2: ", fill2)

  // Calculate the proportions
  var total = value1 + value2;
  var proportion1 = value1 / total;
  var proportion2 = value2 / total;

  // Set the width and left position of the fills based on proportions
  fill1.style.width = proportion1 * 100 + "%";
  fill2.style.width = proportion2 * 100 + "%";
  fill2.style.left = proportion1 * 100 + "%";
}

function allowDrop(event) {
  event.preventDefault();
}




function drag(event) {
  var target = event.target;

  if (!target.classList.contains("list-item")) {
    event.preventDefault();
    return;
  }

  let string = target.textContent;
  let mmr_number = null;
  let winrate = null;

  if (typeof string === "string") {
    let matchMmr = string.match(/\((\d+)\)/); // Regular expression to extract mmr_number
    let matchWinrate = string.match(/\((\d+\.\d+%)\)/); // Regular expression to extract winrate

    if (matchMmr && matchMmr.length > 1) {
      mmr_number = matchMmr[1];
      // console.log(mmr_number);
    } else {
      console.log("MMR number not found");
    }

    if (matchWinrate && matchWinrate.length > 1) {
      winrate = matchWinrate[1];
      // console.log(winrate);
    } else {
      console.log("Winrate not found");
    }
  } else {
    console.log("Invalid input: not a string");
  }

  draggedElement = target;

  // Get the name and remove everything after whitespace
  var name = target.innerText.trim().split(" ")[0];
  // console.log("BEFORE SENDING: ", winrate);

  event.dataTransfer.setData("application/json", JSON.stringify({ name: name, mmr: mmr_number, winrate: winrate}));
}





function drop(event) {
  event.preventDefault();
  console.log("===============================")

  var jsonData = event.dataTransfer.getData("application/json");
  var data = JSON.parse(jsonData);
  var name = data.name;
  var mmr = data.mmr;
  winrate = data.winrate;

  var droppedElement = document.createElement("p");
  droppedElement.textContent = name;

  var droppedElementMmr = document.createElement("span");
  droppedElementMmr.textContent = "(mmr: " + mmr + ")";

  
  var droppedElementWinRate = document.createElement("div");
  droppedElementWinRate.textContent = "Winrate: " + winrate;



  // Create a container element for name and mmr
  var container = document.createElement("div");
  container.appendChild(droppedElement);
  container.appendChild(droppedElementMmr);
  container.appendChild(droppedElementWinRate);

  // Add a class to the container
  container.classList.add("dragged-item");

  // Add the container to the target field
  var targetField = event.target.closest(".field");
  if (!targetField) return;

  var leftField = document.getElementById("field1");
  var rightField = document.getElementById("field2");

 // Remove the name and mmr from the other field if they match the dropped name and mmr
  var otherField = targetField === leftField ? rightField : leftField;
  var otherNameElement = otherField.querySelector(".dragged-item p");
  var otherMmrElement = otherField.querySelector(".dragged-item span");
  var otherName = otherNameElement ? otherNameElement.textContent.trim() : "";
  var otherMmr = otherMmrElement ? otherMmrElement.textContent.trim() : "";

  if (otherName === name && otherMmr === "(mmr: " + mmr + ")") {
    var otherFieldContainer = otherField.querySelector("#field1Small, #field2Small");
    if (otherFieldContainer) {
      otherFieldContainer.remove();
    }
  }

  // Remove existing content from target field before appending the new name and mmr
  var existingContent = targetField.querySelector(".dragged-item");
  if (existingContent) {
    existingContent.remove();
  }

  targetField.appendChild(container);
  container.id = targetField.id + "Small"; // Set the ID of the container
  droppedElementWinRate.className = targetField.id + "Winrate"





  var field1SmallLeft = document.getElementById("field1Small");
  if (field1SmallLeft !== null){
  // console.log("TEST1 left: ", field2SmallRight);
  var htmlContentLeft = field1SmallLeft.innerHTML;
  // console.log("TEST2 left: ", htmlContent);
  var mmrRegex = /\(mmr: (\d+)\)/;
  var mmrMatchLeft = htmlContentLeft.match(mmrRegex);

  var playerNameElementLeft = field1Small.querySelector('p');
  var playerNameLeft = playerNameElementLeft.textContent;
  var playerNameElementRight = field1Small.querySelector('p');
  var playerNameRight = playerNameElementRight.textContent;
  }
  if (mmrMatchLeft) {
    var mmrNumberLeft = mmrMatchLeft[1]; 
    // console.log("MMR leftttttttttttttt:", mmrNumberLeft);
  } else {
    console.log("MMR left not found");
  }

  var field2SmallRight = document.getElementById("field2Small");
  if (field2SmallRight !== null){
  // console.log("TEST1 right: ", field2SmallRight)
  var htmlContent = field2SmallRight.innerHTML;
  // console.log("TEST2 right: ", htmlContent)
  var mmrRegex = /\(mmr: (\d+)\)/;
  var mmrMatchRight = htmlContent.match(mmrRegex);
  }
  if (mmrMatchRight) {
    var mmrNumberRight = mmrMatchRight[1];
    // console.log("MMR righttttttttttttttttt:", mmrNumberRight);
  } else {
    console.log("MMR right not found");
  }

  droppedPlayerName = name

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

let leftElement = document.getElementById("field1Small");
let leftWinrateElement = leftElement?.querySelector("div");
let leftWinrateText = leftWinrateElement?.textContent || "";
let leftWinrate = parseFloat(leftWinrateText.match(/\d+\.\d+/)?.[0] || "0")


let rightElement = document.getElementById("field2Small");
let rightWinrateElement = rightElement?.querySelector("div");
let rightWinrateText = rightWinrateElement?.textContent || "";
let rightWinrate = parseFloat(rightWinrateText.match(/\d+\.\d+/)?.[0] || "0")


leftWinrate = leftWinrate.toString() + "%";
rightWinrate = rightWinrate.toString() + "%";


// leftWinrate = (leftWinrate - 50) / 50 * 0.9 + 0.1;
// rightWinrate = (rightWinrate - 50) / 50 * 0.9 + 0.1;

// var leftWinrate = 0.1
// var rightWinrate = 0.1

 // leftWinrate SCRIPT:  0.8714799999999999
  // rightWinrate SCRIPT:  0.9053199999999999

//   leftWinrate MATCH:  92,86%
//   rightWinrate MATCH:  94,74%


// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // console.log("left Winrate value:", leftWinrateValue);

  // console.log("leftWinrate SCRIPT: ", leftWinrate)
  // console.log("leftWinrate SCRIPT TYPE: ", typeof(leftWinrate))
  // console.log("rightWinrate SCRIPT: ", rightWinrate)
  // console.log("rightWinrate SCRIPT TYPE: ", typeof(rightWinrate))

  
  // console.log("right Winrate value:", rightWinrateValue);

  var [rightProbability, leftProbability] = calculateWinProbabilities(
    mmrMatchLeft,
    mmrMatchRight,
    leftWinrate,
    rightWinrate
  );

  // console.log("Left player's probability of winning:", leftProbability);
  // console.log("Right player's probability of winning:", rightProbability);

  var percentageLeft = (leftProbability * 100).toFixed(2) + "%";
  var percentageRight = (rightProbability * 100).toFixed(2) + "%";

  // console.log("percentageLeft: ", percentageLeft)
  // console.log("percentageRight: ", percentageRight)

  var leftPercentElement = document.getElementById("leftGauge");
  leftPercentElement.textContent = percentageLeft;

  var rightPercentElement = document.getElementById("rightGauge");
  rightPercentElement.textContent = percentageRight;

  // console.log("leftProbability: ", leftProbability)
  // console.log("rightProbability: ", rightProbability)

  // Example usage: update the gauge with values 60 and 40
  updateGauge(leftProbability, rightProbability);












}














function filterNames() {
  var input = document.getElementById("searchInput");
  var filter = input.value.toLowerCase();
  var ul = document.querySelector(".list ul");
  var li = ul.getElementsByTagName("li");

  for (var i = 0; i < li.length; i++) {
    var name = li[i].textContent || li[i].innerText;
    var transformedName = transformString(name);
    var transformedFilter = transformString(filter);
    
    // Check if the original name or transformed name contains the filter
    if (name.includes(filter) || transformedName.includes(transformedFilter)) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

function transformString(str) {
  // Replace '3' with 'e' and convert to lowercase
  var transformedStr = str.replace(/3/g, 'e').toLowerCase();
  return transformedStr;
}

document.addEventListener("DOMContentLoaded", function () {




  // Check if the page has been refreshed before
  if (!localStorage.getItem('pageRefreshed')) {
    // Set the flag in localStorage to indicate the page has been refreshed
    localStorage.setItem('pageRefreshed', true);
    // Reload the page
    location.reload();
  }
  var searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", filterNames);

  var submitButton = document.getElementById("submitButton");
  var cancelButton = document.getElementById("cancelButton");
  var confirmationModal = document.getElementById("confirmationModal");
  var confirmYes = document.getElementById("confirmYes");
  var confirmNo = document.getElementById("confirmNo");
  var clearButtonALL = document.getElementById("clearButtonALL");

  submitButton.addEventListener("click", function () {
    var leftField = document.getElementById("field1");
    var rightField = document.getElementById("field2");
    var errorMessage = document.getElementById("error-message");
  
    var leftNameElement = leftField.querySelector(".dragged-item p");
    var rightNameElement = rightField.querySelector(".dragged-item p");
    // console.log("leftNameElement: ", leftNameElement)
    // console.log("rightNameElement: ", rightNameElement)

  
    if (
      leftNameElement && leftNameElement.textContent.trim() !== "" &&
      leftNameElement.textContent.trim() !== "Player Left" &&
      rightNameElement && rightNameElement.textContent.trim() !== "" &&
      rightNameElement.textContent.trim() !== "Player Right"
    ) {
      confirmationModal.style.display = "block";
    } else {
      errorMessage.textContent = "Please enter names into both fields.";
      errorMessage.classList.add("show");
  
      // Remove the error class after 2 seconds
      setTimeout(function () {
        errorMessage.classList.remove("show");
      }, 2000);
    }



  });
  

  // CSS STUFF FOR YES NO
  confirmYes.style.fontSize = "20px";
  confirmYes.style.padding = "10px 20px";
  confirmYes.style.backgroundColor = "#4CAF50";
  confirmYes.style.color = "#fff";
  confirmYes.style.border = "none";
  confirmYes.style.borderRadius = "4px";
  confirmYes.style.cursor = "pointer";

  confirmNo.style.fontSize = "20px";
  confirmNo.style.padding = "10px 20px";
  confirmNo.style.backgroundColor = "#f44336";
  confirmNo.style.color = "#fff";
  confirmNo.style.border = "none";
  confirmNo.style.borderRadius = "4px";
  confirmNo.style.cursor = "pointer";

  // Modify text content of list items
  var listItems = document.querySelectorAll(".list-item");
  listItems.forEach(function (item) {
    item.textContent = item.textContent.slice(2, -2);
  });

  function sendUserInfo(){

    

  var leftField = document.getElementById("field1Small");
  var leftNameElement = leftField.querySelector("p");
  var leftName = leftNameElement ? leftNameElement.textContent.trim() : "";

  

  var rightField = document.getElementById("field2Small");
  var rightNameElement = rightField.querySelector("p");
  var rightName = rightNameElement ? rightNameElement.textContent.trim() : "";

  // console.log("SENT: ", leftName)
  // console.log("SENT: ", rightName)

    let userInfo = {
      '1name': leftName,
      '2name': rightName
    }
    const request = new XMLHttpRequest()
    request.open('POST', `/processUserInfo/${JSON.stringify(userInfo)}`);
    request.onload = () => {
      // const flaskMessage = request.responseText
      // console.log(flaskMessage)
    }
    request.send()
  }

  confirmYes.addEventListener("click", function () {
    sessionStorage.removeItem("refreshFlag");
    var leftField = document.getElementById("field1Small");
    var rightField = document.getElementById("field2Small");



    
  
    if (
      leftField.textContent.trim() !== "" &&
      leftField.textContent.trim() !== "Player Left" &&
      rightField.textContent.trim() !== "" &&
      rightField.textContent.trim() !== "Player Right"
    ) {
      sendUserInfo()
      window.location.href = "/matchmaking/match/processing";
    }
  });

  
  
  // Event listener to handle the retrieved values
  // document.addEventListener("valuesRetrieved", function (event) {
  //   var data = event.detail; // Retrieve the values from the event
  
  //   // Perform further processing or AJAX request with the retrieved values
  //   $.ajax({
  //     type: "POST",
  //     url: "/matchmaking",
  //     data: JSON.stringify(data),
  //     dataType: "json",
  //     contentType: "application/json", // Specify content type as JSON
  //     success: function (response) {
  //       console.log(response);
  //     },
  //   });
  // });

  




  

  
  
  

  confirmNo.addEventListener("click", function () {
    confirmationModal.style.display = "none";
  });

  cancelButton.addEventListener("click", function () {
    window.location.reload();
  });

  var clearButton1 = document.getElementById("clearButton1");
  var clearButton2 = document.getElementById("clearButton2");
  var clearButtonALL = document.getElementById("clearButtonALL");

  clearButton1.addEventListener("click", function () {
    var leftPlayer = document.getElementById("field1Small");
    if (leftPlayer) {
      // console.log("CLICK")
      leftPlayer.remove()
    }
  });
  

  clearButton2.addEventListener("click", function () {
    var rightPlayer = document.getElementById("field2Small");
    if (rightPlayer) {
      rightPlayer.remove();
    }
  });

  clearButtonALL.addEventListener("click", function () {

    var leftPlayer = document.getElementById("field1Small");
    if (leftPlayer) {
      // console.log("CLICK")
      leftPlayer.remove()
    }

    var rightPlayer = document.getElementById("field2Small");
    if (rightPlayer) {
      rightPlayer.remove();
    }
    
  });
});

// Disable dragstart event for selected elements
document.addEventListener("dragstart", function (event) {
  var selectedElements = window.getSelection().toString();
  if (selectedElements !== "") {
    event.preventDefault();
  }
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
                var response = JSON.parse(xhr.responseText);
                console.log(response.message);
                window.location.href = "/login"
                // Handle the response as needed
            } else {
                console.log('Error: ' + xhr.status);
                // Handle the error as needed
            }
        }
    };
    xhr.send(JSON.stringify({ 'key': key }));
});

var homeBtn = document.getElementById("home");
homeBtn.addEventListener("click", function() {
    // Redirect to the login page or perform necessary actions
    window.location.href = "/main";
});








var selectElement = document.getElementById("image-select");
var selectedImageElement = document.getElementById("selected-image");
var submitButton = document.getElementById("confirmYes");

// Function to handle the selection change
function handleSelectionChange() {
  var selectedOption = selectElement.options[selectElement.selectedIndex];
  var selectedImage = selectedOption.getAttribute("data-image");
  var selectedName = selectedOption.text;

  // Update the displayed image
  selectedImageElement.src = selectedImage;
  return selectedName;
}

// Add event listener for selection change
selectElement.addEventListener("change", handleSelectionChange);

// Function to handle button click event
function handleButtonClick() {
  var selectedName = handleSelectionChange();

  // Make an HTTP request to the Flask server
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/sendJet", true);
  xhr.setRequestHeader("Content-Type", "application/json");

  // Send the selected name to the Flask server
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        // Request succeeded, handle the response here
        console.log(xhr.responseText);
      } else {
        // Request failed, handle the error here
        console.error("Error:", xhr.status);
      }
    }
  };

  xhr.send(JSON.stringify({ selectedName: selectedName }));
}


// Add event listener for button click
submitButton.addEventListener("click", handleButtonClick);

// Trigger selection change on page load
handleSelectionChange();