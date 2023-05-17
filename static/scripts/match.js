var urlParams = new URLSearchParams(window.location.search);
var dragged = urlParams.get("dragged");

var draggedItem = document.getElementById('playerName1');
draggedItem.textContent = dragged;

// Use the 'dragged' value as needed in your script
console.log("Dragged item:", dragged);

document.addEventListener("DOMContentLoaded", function () {

    var toMaking = document.getElementById("toMaking");
    toMaking.addEventListener("click", function () {
    window.location.href = "/matchmaking";
    });

    

    
});
