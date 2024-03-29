// const { type } = require("os");

function calculateWinProbabilities(
  leftRating,
  rightRating,
  leftWinrate,
  rightWinrate
) {
  if (leftRating !== null && typeof leftRating !== "undefined") {
    leftRating = leftRating[1];
  }

  if (rightRating !== null && typeof rightRating !== "undefined") {
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

// Select the draggable elements
const draggableElements = document.querySelectorAll('.matchmaking-list-item');

// Attach the drag event listener to each draggable element
draggableElements.forEach((element) => {
  element.addEventListener('dragstart', drag);
});


function drag(event) {
  console.log('Drag function called');
  var target = event.target;

  console.log("TARGET: ", target)

  if (!target.classList.contains("matchmaking-list-item")) {
    event.preventDefault();
    return;
  }

  let string = target.textContent;
  console.log("STRING: ", string)
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

  event.dataTransfer.setData(
    "application/json",
    JSON.stringify({ name: name, mmr: mmr_number, winrate: winrate })
  );
}

function drop(event) {
  event.preventDefault();
  console.log("===============================");

  var jsonData = event.dataTransfer.getData("application/json");
  var data = JSON.parse(jsonData);
  var name = data.name;
  var mmr = data.mmr;
  winrate = data.winrate;

  var droppedElement = document.createElement("p");
  droppedElement.textContent = name;


  
  // // Extract the name by finding the index of the first opening parenthesis
  // var startIndex = name.indexOf("(");
  // var visualName = name.slice(0, startIndex).trim();

  // var visualDroppedElement = document.createElement("h1");
  // visualDroppedElement.textContent = visualName;




  var droppedElementMmr = document.createElement("span");
  droppedElementMmr.textContent = "(mmr: " + mmr + ")";

  var droppedElementWinRate = document.createElement("div");
  droppedElementWinRate.textContent = "Winrate: " + winrate;

  // Create a container element for name and mmr
  var container = document.createElement("div");
  // container.appendChild(visualDroppedElement);
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
    var otherFieldContainer = otherField.querySelector(
      "#field1Small, #field2Small"
    );
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
  droppedElementWinRate.className = targetField.id + "Winrate";

  var [mmrMatchLeft, mmrMatchRight, leftWinrate, rightWinrate] =
    getMMRAndWinrate();

  var [rightProbability, leftProbability] = calculateWinProbabilities(
    mmrMatchLeft,
    mmrMatchRight,
    leftWinrate,
    rightWinrate
  );

  var percentageLeft = (leftProbability * 100).toFixed(2) + "%";
  var percentageRight = (rightProbability * 100).toFixed(2) + "%";

  var leftPercentElement = document.getElementById("leftGauge");
  leftPercentElement.textContent = percentageLeft;

  var rightPercentElement = document.getElementById("rightGauge");
  rightPercentElement.textContent = percentageRight;

  console.log("percentageLeft: ", percentageLeft)
  console.log("percentageRight: ", percentageRight)


  updateGauge(leftProbability, rightProbability);
}

function getMMRAndWinrate() {
  var mmrMatchLeft = null;
  var mmrMatchRight = null;
  var leftWinrate = 0;
  var rightWinrate = 0;

  var field1SmallLeft = document.getElementById("field1Small");
  if (field1SmallLeft !== null) {
    var htmlContentLeft = field1SmallLeft.innerHTML;
    var mmrRegex = /\(mmr: (\d+)\)/;
    mmrMatchLeft = htmlContentLeft.match(mmrRegex);

    var playerNameElementLeft = field1Small.querySelector("p");
    var playerNameLeft = playerNameElementLeft.textContent;
    var playerNameElementRight = field1Small.querySelector("p");
    var playerNameRight = playerNameElementRight.textContent;
  }
  if (mmrMatchLeft) {
    var mmrNumberLeft = mmrMatchLeft[1];
  } else {
    console.log("MMR left not found");
  }

  var field2SmallRight = document.getElementById("field2Small");
  if (field2SmallRight !== null) {
    var htmlContent = field2SmallRight.innerHTML;
    var mmrRegex = /\(mmr: (\d+)\)/;
    mmrMatchRight = htmlContent.match(mmrRegex);
  }
  if (mmrMatchRight) {
    var mmrNumberRight = mmrMatchRight[1];
  } else {
    console.log("MMR right not found");
  }

  let leftElement = document.getElementById("field1Small");
  let leftWinrateElement = leftElement?.querySelector("div");
  let leftWinrateText = leftWinrateElement?.textContent || "";
  leftWinrate = parseFloat(leftWinrateText.match(/\d+\.\d+/)?.[0] || "0");

  let rightElement = document.getElementById("field2Small");
  let rightWinrateElement = rightElement?.querySelector("div");
  let rightWinrateText = rightWinrateElement?.textContent || "";
  rightWinrate = parseFloat(rightWinrateText.match(/\d+\.\d+/)?.[0] || "0");

  leftWinrate = leftWinrate.toString() + "%";
  rightWinrate = rightWinrate.toString() + "%";

  return [mmrMatchLeft, mmrMatchRight, leftWinrate, rightWinrate];
}

function filterNames() {
  var inputs = document.getElementsByClassName("searchBar"); // Updated to select all search input elements with the class "searchBar"
  for (var j = 0; j < inputs.length; j++) {
    var input = inputs[j];
    var filter = input.value.toLowerCase();
    var ul = input.closest(".list").querySelector("ul"); // Updated to select the closest "ul" element within the parent "list" container
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
}

var searchInputs = document.getElementsByClassName("searchBar");
for (var i = 0; i < searchInputs.length; i++) {
  searchInputs[i].addEventListener("input", filterNames);
}

function transformString(str) {
  // Replace '3' with 'e' and convert to lowercase
  var transformedStr = str.replace(/3/g, "e").toLowerCase();
  return transformedStr;
}

document.addEventListener("DOMContentLoaded", function () {
  
  // Check if the page has been refreshed before
  if (!localStorage.getItem("pageRefreshed")) {
    // Set the flag in localStorage to indicate the page has been refreshed
    localStorage.setItem("pageRefreshed", true);
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
      leftNameElement &&
      leftNameElement.textContent.trim() !== "" &&
      leftNameElement.textContent.trim() !== "Player Left" &&
      rightNameElement &&
      rightNameElement.textContent.trim() !== "" &&
      rightNameElement.textContent.trim() !== "Player Right"
    ) {
      confirmationModal.style.display = "flex";
    } else {
      errorMessage.textContent = "Please enter names into both fields.";
      errorMessage.classList.add("show");

      // Remove the error class after 2 seconds
      setTimeout(function () {
        errorMessage.classList.remove("show");
      }, 2000);
    }
  });

  // Modify text content of list items
  var listItems = document.querySelectorAll(".list-item");
  listItems.forEach(function (item) {
    item.textContent = item.textContent.slice(2, -2);
  });

  function sendUserInfo() {
    var leftField = document.getElementById("field1Small");
    var leftNameElement = leftField.querySelector("p");
    var leftName = leftNameElement ? leftNameElement.textContent.trim() : "";

    var rightField = document.getElementById("field2Small");
    var rightNameElement = rightField.querySelector("p");
    var rightName = rightNameElement ? rightNameElement.textContent.trim() : "";

    console.log("SENT: ", leftName);
    console.log("SENT: ", rightName);

    var fixLeftName = leftName.substring(0, leftName.indexOf("\n")).trim();
    var fixRightName = rightName.substring(0, rightName.indexOf("\n")).trim();

    let userInfo = {
      "1name": fixLeftName,
      "2name": fixRightName,
    };
    const request = new XMLHttpRequest();
    request.open("POST", `/processUserInfo/${JSON.stringify(userInfo)}`);
    request.onload = () => {
      // const flaskMessage = request.responseText
      // console.log(flaskMessage)
    };
    request.send();
  }



  
  // Establish a connection to the server
  var socket = io();



  window.onload = function () {
    // Get the match data (you might need to fetch it from your data source)


    // Emit the 'match_status' event with the match data
    socket.emit('match_status');
};





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
      sendUserInfo();
      console.log("SENT");


      // Select the left element by its ID
      const leftElement = document.querySelector('#field1Small');

      // Get the text content of the <p> element
      const leftPElement = leftElement.querySelector('p');
      const leftTextContent = leftPElement.textContent;

      // Extract the name from the text content
      const leftName = leftTextContent.split(' ')[0];

      // Extract the MMR from the text content (using regular expression)
      const leftMMRMatch = leftTextContent.match(/\((\d+)\)/);
      const leftMMR = leftMMRMatch ? parseInt(leftMMRMatch[1]) : null;

      // Select the right element by its ID
      const rightElement = document.querySelector('#field2Small');

      // Get the text content of the <p> element
      const rightPElement = rightElement.querySelector('p');
      const rightTextContent = rightPElement.textContent;

      // Extract the name from the text content
      const rightName = rightTextContent.split(' ')[0];

      // Extract the MMR from the text content (using regular expression)
      const rightMMRMatch = rightTextContent.match(/\((\d+)\)/);
      const rightMMR = rightMMRMatch ? parseInt(rightMMRMatch[1]) : null;
      console.log("leftName: ", leftName)
      console.log("leftMMR: ", leftMMR)
      console.log("rightName: ", rightName)
      console.log("rightMMR: ", rightMMR)




      fetch('/send-discord-message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            playerLeft: leftName,
            mmrLeft: leftMMR,
            playerRight: rightName,
            mmrRight: rightMMR
        }),
    });

    //HERE1
    

    var match_data;

    
    
    // Redirect to the processing page (if needed)
    window.location.href = "/matchmaking/match/processing";

      // Emit the 'match_status' event to the server
      socket.emit('match_status', match_data);
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
      leftPlayer.remove();
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
      leftPlayer.remove();
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

var selectElement = document.getElementById("image-select");
var selectedImageElement = document.getElementById("selected-image");

// Function to handle the selection change
function handleSelectionChange() {
  var selectedOption = selectElement.options[selectElement.selectedIndex];
  var selectedImage = selectedOption.getAttribute("data-image");
  var selectedName = selectedOption.text;

  // Update the displayed image
  selectedImageElement.src = selectedImage;

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
  console.log(selectedName); // Log the selected name

  // Save the selected option value to localStorage
  localStorage.setItem("selectedOption", selectElement.value);
}

// Add event listener for selection change
selectElement.addEventListener("change", handleSelectionChange);

// Set the selected option as the default on page load
window.addEventListener("load", function () {
  // Retrieve the selected option value from localStorage
  var selectedOptionValue = localStorage.getItem("selectedOption");

  if (selectedOptionValue) {
    // Find the option with the retrieved value and set it as selected
    for (var i = 0; i < selectElement.options.length; i++) {
      if (selectElement.options[i].value === selectedOptionValue) {
        selectElement.selectedIndex = i;
        break;
      }
    }
  }

  handleSelectionChange(); // Trigger selection change
});

function openWindow() {
  // JavaScript function to open a new window or pop-up
  window.open("https://example.com", "_blank", "width=500,height=400");
}

function openModal2() {
  document.getElementById("modal2").style.display = "flex";

  // Check if the userInput element exists
  var userInput = document.getElementById("userInput");
  if (userInput) {
    userInput.value = ""; // Clear the input field
  }
}

function closeModal2() {
  var modal2 = document.getElementById("modal2");
  if (modal2) {
    modal2.style.display = "none";
    document.getElementById("usernameInput").value = "";
  }
}

function addUsername() {
  var username = document.getElementById("usernameInput").value;
  var confirmField = document.querySelector(".confirmField");
  var addBtn = document.querySelector(".add2");
  var cancelBtn = document.querySelector(".cancel2");

  confirmField.innerHTML = ""; // Clear the confirm field

  if (username.trim() !== "") {
    var usernameElement = document.createElement("span");
    usernameElement.textContent = username;

    confirmField.appendChild(usernameElement);
    document.getElementById("usernameInput").value = "";

    addBtn.style.display = "inline-block"; // Show the confirm button
    cancelBtn.style.display = "inline-block"; // Show the cancel button
  }
}

function cancelConfirmation() {
  var confirmField = document.getElementById("confirmField");
  confirmField.innerHTML = ""; // Clear the confirm field
  document.getElementById("usernameInput").value = "";
  var addBtn = document.querySelector(".add2");
  var cancelBtn = document.querySelector(".cancel2");
  addBtn.style.display = "none"; // Hide the confirm button
  cancelBtn.style.display = "none"; // Hide the cancel button
}

function confirmUsername() {
  var confirmField = document.getElementById("confirmField");
  var username = confirmField.textContent.trim();

  if (username !== "") {
    // Show loading animation
    var loadingMessage = document.createElement("span");
    loadingMessage.classList.add("loading-animation");
    confirmField.appendChild(loadingMessage);

    // Create an HTTP request object
    var xhr = new XMLHttpRequest();
    var url = "/register_username"; // Replace with your Python API URL

    // Configure the request
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    // Define the data to send
    var data = JSON.stringify({ username: username });

    // Handle the response
    xhr.onload = function () {
      if (xhr.status === 200) {
        console.log("Request successful");
        console.log("Response:", xhr.responseText);

        location.reload();
      } else {
        console.log("Request failed");
      }
    };

    // Send the request
    xhr.send(data);
  }
}

const customPoolBtn = document.getElementById("customPoolBtn");
const modal = document.getElementById("myModal");
const closeBtn = document.getElementsByClassName("close")[0];

// Open the modal when the button is clicked
customPoolBtn.addEventListener("click", function () {
  modal.style.display = "flex";
});

// Close the modal when the close button is clicked
closeBtn.addEventListener("click", function () {
  modal.style.display = "none";
});

// Close the modal when the user clicks outside the modal content
window.addEventListener("click", function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// Get the checkboxes
const checkboxes = document.querySelectorAll(".checkmark");

// Get the selected names list
const selectedNamesList = document.getElementById("selectedNamesList");

// Retrieve stored selections from local storage
const storedSelections = localStorage.getItem("selectedNames");
// Convert stored selections to an array or initialize an empty array
const selections = storedSelections ? JSON.parse(storedSelections) : [];

// Iterate through checkboxes and set their checked state
checkboxes.forEach(function (checkbox) {
  const listItem = checkbox.parentNode; // Get the parent list item
  const listItemHTML = listItem.innerHTML; // Get the HTML content of the list item

  checkbox.checked = selections.includes(listItemHTML);

  checkbox.addEventListener("change", function () {
    if (this.checked) {
      // console.log(listItemHTML)

      selections.push(listItemHTML);
    } else {
      const index = selections.indexOf(listItemHTML);
      if (index > -1) {
        selections.splice(index, 1);
      }
    }

    // Store updated selections in local storage
    localStorage.setItem("selectedNames", JSON.stringify(selections));

    updateSelectedNamesList();

    var selectedNamesList = document.querySelector("#selectedNamesList");
    console.log("selectedNamesList: ", selectedNamesList);
    var checkmarks = selectedNamesList.querySelectorAll(".checkmark");

    for (var i = 0; i < checkmarks.length; i++) {
      var checkmark = checkmarks[i];
      console.log("checkmark: ", checkmark);
      checkmark.remove();
    }


  });
});

// Update the selected names list
function updateSelectedNamesList() {
  selectedNamesList.innerHTML = "";
  selections.forEach(function (listItemHTML) {
    const listItem = document.createElement("li");
    listItem.innerHTML = listItemHTML;
    listItem.classList.add("added-item", "matchmaking-list-item"); // Add a class for styling

    // Create the remove button
    const removeButton = document.createElement("button");
    removeButton.innerHTML = '<img src="/static/icons/remove.svg">';
    removeButton.classList.add("remove-button"); // Add a class for styling

    // Add click event listener to the remove button
    removeButton.addEventListener("click", function () {
      listItem.remove();

      const index = selections.indexOf(listItemHTML);
      if (index > -1) {
        selections.splice(index, 1);
        localStorage.setItem("selectedNames", JSON.stringify(selections));
      }
    });

    // Append the remove button to the list item
    listItem.appendChild(removeButton);

    selectedNamesList.appendChild(listItem);
  });
}

// Update the selected names list on page load
updateSelectedNamesList();

// Random Match button event listener
const randomMatchButton = document.querySelector(".random");
randomMatchButton.addEventListener("click", generateRandomMatch);

const autoMatchButton = document.querySelector(".auto");
autoMatchButton.addEventListener("click", generateAutoMatch);

function convertObjectToString(object) {
  const { name, mmr, win_rate } = object;

  const string = `<input type="checkbox" class="checkmark" data-name="${name}">
          ${name}
          <span id="flag_${name}">(${mmr})</span>
          <span id="flag_${name}">(${win_rate}%)</span>`;

  return string;
}

// Generate a random match
function generateRandomMatch() {
  const shuffledSelections = shuffleArray(selections); // Shuffle the selections array
  const randomPair = shuffledSelections.slice(0, 2); // Get the first two elements as the random pair

  if (randomPair.length === 2) {
    const leftPlayer = randomPair[0];
    const rightPlayer = randomPair[1];

    console.log("leftPlayerRANDOM: ", leftPlayer);
    // console.log("leftPlayerRANDOM TYPE: ", typeof(leftPlayer))
    // console.log("rightPlayerRANDOM: ", rightPlayer)

    // Add the left and right players to the fields
    addPlayerToLeftField(leftPlayer);
    addPlayerToRightField(rightPlayer);
  } else {
    console.log("Insufficient selected names to generate a random pair.");
  }
}
//=======================================================================================
//=======================================================================================
const pastList = [];

function generateAutoMatch() {
  console.log("AUTO CLICKED");
  const playersListHTML = selections;
  const nameRegex = /data-name="([^"]+)"/;

  const namesList = [];
  for (let i = 0; i < playersListHTML.length; i++) {
    const match = playersListHTML[i].match(nameRegex);
    const playerName = match ? match[1] : null;
    namesList.push(playerName);
  }

  // console.log(namesList)

  fetch("/autoMatch", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(namesList),
  })
    .then((response) => response.json())
    .then((responseData) => {
      // Handle the response from Flask
      // console.log(responseData);

      const mostBalancedPair = findMostBalancedPair(responseData);

      // console.log('Most Balanced Pair: ', mostBalancedPair.map(item => item.name));
      console.log("================================================");

      function findMostBalancedPair(data) {
        // console.log("pastList: ", pastList.map(item => item.name));
        const pairsRaw = Object.values(data);
        // console.log("pairsRaw: ", pairsRaw.map(item => item.name));
        const pairs = pairsRaw.filter(
          (obj) => !pastList.some((item) => item.name === obj.name)
        );
        // console.log("pairs: ", pairs.map(item => item.name));

        let mostBalancedPair = null;
        let minBalanceScore = Infinity;

        for (let i = 0; i < pairs.length - 1; i++) {
          const playerA = pairs[i];
          const playerB = pairs[i + 1];

          const mmrDifference = Math.abs(playerA.mmr - playerB.mmr);
          const winsDifference = Math.abs(playerA.wins - playerB.wins);
          const lossesDifference = Math.abs(playerA.losses - playerB.losses);
          const winRateDifference = Math.abs(
            playerA.win_rate - playerB.win_rate
          );

          // Define a scoring mechanism that combines the differences in different factors
          const balanceScore =
            mmrDifference +
            winsDifference +
            lossesDifference +
            winRateDifference;

          if (balanceScore < minBalanceScore) {
            minBalanceScore = balanceScore;
            mostBalancedPair = [playerA, playerB];
          }
        }

        for (let x = 0; x < mostBalancedPair.length; x++) {
          pastList.push(mostBalancedPair[x]);
        }

        if (pairs.length <= 3) {
          pastList.splice(0, pastList.length); // Reset the pastList to an empty array
          console.log("reset");
        }
        return mostBalancedPair;
      }

      let leftPlayerObj = mostBalancedPair[0];
      let rightPlayerObj = mostBalancedPair[1];

      let leftPlayer = convertObjectToString(leftPlayerObj);
      let rightPlayer = convertObjectToString(rightPlayerObj);
      console.log("leftPlayerObjAUTO: ", leftPlayerObj);
      console.log("leftPlayerAUTO: ", leftPlayer);
      // console.log("leftPlayerAUTO TYPE: ", typeof(leftPlayer))
      // console.log("rightPlayerAUTO: ", rightPlayer)

      // Add the left and right players to the fields
      addPlayerToLeftField(leftPlayer);
      addPlayerToRightField(rightPlayer);
    })

    .catch((error) => {
      console.error("Error:", error);
    });
}

//=======================================================================================
//=======================================================================================
// Add a player to the left field
function addPlayerToLeftField(playerHTML) {
  const leftField = document.getElementById("field1");

  // Remove the existing content from the left field
  const existingContent = leftField.querySelector(".dragged-item");
  if (existingContent) {
    existingContent.remove();
  }

  const container = createPlayerContainer(playerHTML);
  container.setAttribute("id", "field1Small");
  leftField.appendChild(container);

  // Add class to the winrate div
  const winrateDiv = container.querySelector("div");
  if (winrateDiv && winrateDiv.textContent.startsWith("Winrate:")) {
    winrateDiv.classList.add("field2Winrate");
  }

  var [mmrMatchLeft, mmrMatchRight, leftWinrate, rightWinrate] =
    getMMRAndWinrate();

  var [rightProbability, leftProbability] = calculateWinProbabilities(
    mmrMatchLeft,
    mmrMatchRight,
    leftWinrate,
    rightWinrate
  );

  var percentageLeft = (leftProbability * 100).toFixed(2) + "%";
  var percentageRight = (rightProbability * 100).toFixed(2) + "%";

  var leftPercentElement = document.getElementById("leftGauge");
  leftPercentElement.textContent = percentageLeft;

  var rightPercentElement = document.getElementById("rightGauge");
  rightPercentElement.textContent = percentageRight;

  updateGauge(leftProbability, rightProbability);

  // console.log("playerHTMLleft: ", playerHTML);
}

//=======================================================================================

// Add a player to the right field
function addPlayerToRightField(playerHTML) {
  const rightField = document.getElementById("field2");

  // Remove the existing content from the right field
  const existingContent = rightField.querySelector(".dragged-item");
  if (existingContent) {
    existingContent.remove();
  }

  const container = createPlayerContainer(playerHTML);
  container.setAttribute("id", "field2Small");
  rightField.appendChild(container);

  // Add class to the winrate div
  const winrateDiv = container.querySelector("div");
  if (winrateDiv && winrateDiv.textContent.startsWith("Winrate:")) {
    winrateDiv.classList.add("field2Winrate");
  }

  var [mmrMatchLeft, mmrMatchRight, leftWinrate, rightWinrate] =
    getMMRAndWinrate();

  var [rightProbability, leftProbability] = calculateWinProbabilities(
    mmrMatchLeft,
    mmrMatchRight,
    leftWinrate,
    rightWinrate
  );

  var percentageLeft = (leftProbability * 100).toFixed(2) + "%";
  var percentageRight = (rightProbability * 100).toFixed(2) + "%";

  var leftPercentElement = document.getElementById("leftGauge");
  leftPercentElement.textContent = percentageLeft;

  var rightPercentElement = document.getElementById("rightGauge");
  rightPercentElement.textContent = percentageRight;

  updateGauge(leftProbability, rightProbability);

  // console.log("playerHTMLright: ", playerHTML);
}

//=======================================================================================

// =====================================================================================

function createPlayerContainer(playerHTML) {
  const container = document.createElement("div");
  container.classList.add("dragged-item");

  const playerName = document.createElement("p");
  playerName.textContent = getPlayerName(playerHTML);
  container.appendChild(playerName);

  const mmrSpan = document.createElement("span");
  mmrSpan.textContent = getPlayerMMR(playerHTML);
  container.appendChild(mmrSpan);

  const winrateSpan = document.createElement("div");
  winrateSpan.textContent = getPlayerWinrate(playerHTML);
  container.appendChild(winrateSpan);

  return container;
}

function getPlayerName(playerHTML) {
  // Extract the player name from the playerHTML string
  const playerName = playerHTML.match(/>([^<]+)</);
  if (playerName && playerName.length > 1) {
    return playerName[1].trim();
  }
  return "";
}

function getPlayerMMR(playerHTML) {
  // Extract the MMR value from the playerHTML string
  const mmr = playerHTML.match(/\((\d+)\)/);
  if (mmr && mmr.length > 1) {
    return `(mmr: ${mmr[1]})`;
  }
  return "";
}

function getPlayerWinrate(playerHTML) {
  // Extract the winrate value from the playerHTML string
  const winrate = playerHTML.match(/\(([\d.]+%)\)/);
  if (winrate && winrate.length > 1) {
    return `Winrate: ${winrate[1]}`;
  }
  return "";
}

// Shuffle an array using Fisher-Yates algorithm
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function refreshButtonClick() {
  console.log("refresh clicked");

  setTimeout(() => {
    fetch("/dbSync", {
      method: "POST",
    })
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        // Reload
        location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, 500);
}

document
  .getElementById("refreshButton")
  .addEventListener("click", refreshButtonClick);
