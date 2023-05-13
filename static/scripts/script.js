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
  
    // Check if the name already exists in the target field
    var isNameExists = Array.from(targetField.children).some(function (child) {
      return child.textContent === name;
    });
  
    if (!isNameExists) {
      targetField.appendChild(droppedElement);
    }
  
    draggedElement.style.opacity = "1";
    
    var leftField = document.getElementById("field1");
    var leftName = leftField.textContent;
    
    var rightField = document.getElementById("field2");
    var rightName = rightField.textContent;
    
    console.log("Left Name: " + leftName);
    console.log("Right Name: " + rightName);
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
  
  var searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", filterNames);
  
  