function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  var target = event.target;
  // console.log(target)

  // Check if the event target is a list item
  if (!target.classList.contains("list-item")) {
    // Cancel the drag operation
    event.preventDefault();
    return;
  }

  

  let string = target.textContent;
  let mmr_number = null;

  if (typeof string === "string") {
    let match = string.match(/\((\d+)\)/);

    if (match && match.length > 1) {
      mmr_number = match[1];
      console.log(mmr_number);
    } else {
      console.log("MMR number not found");
    }
  } else {
    console.log("Invalid input: not a string");
  }

  draggedElement = target;

  // Get the name and remove everything after whitespace
  var name = target.innerText.trim().split(" ")[0];

  event.dataTransfer.setData("application/json", JSON.stringify({ name: name, mmr: mmr_number }));
}




function drop(event) {
  event.preventDefault();

  var jsonData = event.dataTransfer.getData("application/json");
  var data = JSON.parse(jsonData);
  var name = data.name;
  var mmr = data.mmr;

  var droppedElement = document.createElement("p");
  droppedElement.textContent = name;

  var droppedElementMmr = document.createElement("span");
  droppedElementMmr.textContent = "(mmr: " + mmr + ")";

  // Create a container element for name and mmr
  var container = document.createElement("div");
  container.appendChild(droppedElement);
  container.appendChild(droppedElementMmr);

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

  console.log("SENT: ", leftName)
  console.log("SENT: ", rightName)

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
      console.log("CLICK")
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
      console.log("CLICK")
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