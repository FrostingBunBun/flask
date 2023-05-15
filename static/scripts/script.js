function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  draggedElement = event.target;
  event.dataTransfer.setData("text/plain", event.target.innerText);
}

function drop(event) {
  event.preventDefault();
  var name = event.dataTransfer.getData("text/plain");
  var droppedElement = document.createElement("p");
  droppedElement.textContent = name;

  console.log("Dropped name: " + name);

  // Find the target field element
  var targetField = event.target.closest(".field");
  if (!targetField) return;

  // Remove existing content before appending the new name
  var existingContent = targetField.querySelector("p");
  if (existingContent && existingContent.textContent !== name) {
    existingContent.remove();
  }

  // Check if the name already exists in the other field
  var otherField = targetField.id === "field1" ? "field2" : "field1";
  var otherContent = document.getElementById(otherField).querySelector("p");
  if (otherContent && otherContent.textContent === name) {
    otherContent.remove();
  }

  targetField.appendChild(droppedElement);
  draggedElement.style.opacity = "1";

  var leftField = document.getElementById("field1");
  var leftName = leftField.textContent;

  var rightField = document.getElementById("field2");
  var rightName = rightField.textContent;

  console.log("Left Name: " + leftName);
  console.log("Right Name: " + rightName);

  // Show the list after items have been moved to the left
  document.getElementById("list").classList.remove("list-hidden");
}

function filterNames() {
  var input = document.getElementById("searchInput");
  var filter = input.value.toUpperCase();
  var ul = document.querySelector(".list ul");
  var li = ul.getElementsByTagName("li");

  for (var i = 0; i < li.length; i++) {
    var name = li[i].textContent || li[i].innerText;
    if (name.toUpperCase().startsWith(filter)) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", filterNames);

  var submitButton = document.getElementById("submitButton");
  var cancelButton = document.getElementById("cancelButton");
  var confirmationModal = document.getElementById("confirmationModal");
  var confirmYes = document.getElementById("confirmYes");
  var confirmNo = document.getElementById("confirmNo");



  submitButton.addEventListener("click", function () {
  var leftField = document.getElementById("field1");
  var rightField = document.getElementById("field2");
  var errorMessage = document.getElementById("error-message");

  if (
    (leftField.textContent.trim() !== "" && leftField.textContent.trim() !== "Player Left" && leftField.textContent.trim() !== "Clear") &&
    (rightField.textContent.trim() !== "" && rightField.textContent.trim() !== "Player Right" && rightField.textContent.trim() !== "Clear")
  ) {
    var leftName = leftField.textContent;
    var rightName = rightField.textContent;

    // Create containers for the players
    var leftContainer = document.createElement("div");
    leftContainer.classList.add("player-container");
    var rightContainer = document.createElement("div");
    rightContainer.classList.add("player-container");

    // Create elements for player information
    var leftInfo = document.createElement("p");
    leftInfo.textContent = "Player Left Info"; // Replace with actual information
    var rightInfo = document.createElement("p");
    rightInfo.textContent = "Player Right Info"; // Replace with actual information

    // Append player information to the containers
    leftContainer.appendChild(leftInfo);
    rightContainer.appendChild(rightInfo);

    // Create match result element
    var matchResult = document.createElement("p");
    matchResult.textContent = leftName + " VS " + rightName;

    // Clear the field container
    var fieldContainer = document.getElementById("field-container");
    fieldContainer.innerHTML = "";

    // Append the containers and match result to the field container
    fieldContainer.appendChild(leftContainer);
    fieldContainer.appendChild(matchResult);
    fieldContainer.appendChild(rightContainer);

    confirmationModal.style.display = "none";
    cancelButton.style.display = "block";

    // Reset error message
    errorMessage.textContent = "";
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

  confirmYes.addEventListener("click", function () {
    var leftField = document.getElementById("field1");
    var rightField = document.getElementById("field2");
  
    if (
      (leftField.textContent.trim() !== "" && leftField.textContent.trim() !== "Player Left" && leftField.textContent.trim() !== "Clear") &&
      (rightField.textContent.trim() !== "" && rightField.textContent.trim() !== "Player Right" && rightField.textContent.trim() !== "Clear")
    ) {
      var leftName = leftField.textContent;
      var rightName = rightField.textContent;
  
      var matchResult = document.createElement("p");
      matchResult.textContent = leftName + " VS " + rightName;
      var fieldContainer = document.getElementById("field-container");
      if (fieldContainer) {
        fieldContainer.innerHTML = "";
        fieldContainer.appendChild(matchResult);
  
        confirmationModal.style.display = "none";
  
        // Show the cancel button
        cancelButton.style.display = "block";
      }
    } else {
      // var errorMessage = document.getElementById("error-message");
      // errorMessage.textContent = "Please enter names into both fields.";
    }
  });
  

  confirmNo.addEventListener("click", function () {
    confirmationModal.style.display = "none";
  });
  
  cancelButton.addEventListener("click", function () {
    var leftField = document.getElementById("field1");
    var rightField = document.getElementById("field2");
  
    leftField.textContent = "Player Left";
    rightField.textContent = "Player Right";
  
    // Hide the cancel button
    cancelButton.style.display = "none";
  
    // Show the submit button
    submitButton.style.display = "block";
  
    // Show the list
    document.getElementById("list").classList.remove("list-hidden");
  });






});