function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  var target = event.target;

  // Check if the event target is a list item
  if (!target.classList.contains("list-item")) {
    // Cancel the drag operation
    event.preventDefault();
    return;
  }

  draggedElement = target;
  
  // Get the name and remove everything after whitespace
  var name = target.innerText.trim().split(" ")[0];
  
  event.dataTransfer.setData("text/plain", name);
}


function drop(event) {
  event.preventDefault();
  var name = event.dataTransfer.getData("text/plain");
  var droppedElement = document.createElement("p");
  droppedElement.textContent = name;

  // Add a class to the dropped element
  droppedElement.classList.add("dragged-item");

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

  // Check if the name already exists in the target field
  var targetContent = targetField.querySelector("p");
  if (targetContent && targetContent.textContent === name) {
    return; // Don't add duplicate names
  }

  targetField.appendChild(droppedElement);
  draggedElement.style.opacity = "1";

  var leftField = document.getElementById("field1");
  var leftNameElement = leftField.querySelector("p");
  var leftName = leftNameElement ? leftNameElement.textContent.trim() : "";

  var rightField = document.getElementById("field2");
  var rightNameElement = rightField.querySelector("p");
  var rightName = rightNameElement ? rightNameElement.textContent.trim() : "";

  console.log("Left Name: " + leftName);
  console.log("Right Name: " + rightName);

  // Show the list after items have been moved to the left
  document.getElementById("list").classList.remove("list-hidden");
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

    if (
      leftField.querySelector("p").textContent.trim() !== "" &&
      leftField.querySelector("p").textContent.trim() !== "Player Left" &&
      rightField.querySelector("p").textContent.trim() !== "" &&
      rightField.querySelector("p").textContent.trim() !== "Player Right"
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

  var leftField = document.getElementById("field1");
  var leftNameElement = leftField.querySelector("p");
  var leftName = leftNameElement ? leftNameElement.textContent.trim() : "";

  var rightField = document.getElementById("field2");
  var rightNameElement = rightField.querySelector("p");
  var rightName = rightNameElement ? rightNameElement.textContent.trim() : "";

    let userInfo = {
      '1name': leftName,
      '2name': rightName
    }
    const request = new XMLHttpRequest()
    request.open('POST', `/processUserInfo/${JSON.stringify(userInfo)}`);
    request.onload = () => {
      const flaskMessage = request.responseText
      console.log(flaskMessage)
    }
    request.send()
  }

  confirmYes.addEventListener("click", function () {
    sessionStorage.removeItem("refreshFlag");
    var leftField = document.getElementById("field1");
    var rightField = document.getElementById("field2");
  
    if (
      leftField.textContent.trim() !== "" &&
      leftField.textContent.trim() !== "Player Left" &&
      rightField.textContent.trim() !== "" &&
      rightField.textContent.trim() !== "Player Right"
    ) {
      sendUserInfo()
      window.location.href = "/matchmaking/match";
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
    var rightField = document.getElementById("field1");
    rightField.querySelector("p").textContent = "";
  });

  clearButton2.addEventListener("click", function () {
    var leftField = document.getElementById("field2");
    leftField.querySelector("p").textContent = "";
  });

  clearButtonALL.addEventListener("click", function () {
    var leftField = document.getElementById("field2");
    leftField.querySelector("p").textContent = "";
    var rightField = document.getElementById("field1");
    rightField.querySelector("p").textContent = "";
  });
});

// Disable dragstart event for selected elements
document.addEventListener("dragstart", function (event) {
  var selectedElements = window.getSelection().toString();
  if (selectedElements !== "") {
    event.preventDefault();
  }
});
