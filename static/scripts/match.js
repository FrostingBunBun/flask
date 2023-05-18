document.addEventListener("DOMContentLoaded", function () {
  var toMaking = document.getElementById("toMaking");
  toMaking.addEventListener("click", function () {
    window.location.href = "/matchmaking";
  });

  // var leftField = document.getElementById("playerName1");
  // var leftNameElement = leftField.querySelector("h3");
  // var leftName = leftNameElement ? leftNameElement.textContent.trim() : "";

  // var rightField = document.getElementById("playerName2");
  // var rightNameElement = rightField.querySelector("h3");
  // var rightName = rightNameElement ? rightNameElement.textContent.trim() : "";

  // var LEFTname = '{{ session["leftNAME"] }}';
  // var RIGHTname = '{{ session["rightNAME"] }}';

  // console.log("ON PAGE leftname: ", leftName)
  // console.log("ON PAGE rightname: ", rightName)
  // console.log("RECIEVED leftname: ", LEFTname)
  // console.log("RECIEVED rightname: ", RIGHTname)



  var refreshFlag = sessionStorage.getItem("refreshFlag");

  if (refreshFlag !== "true") {
    // Set the session variable to indicate that refresh has been triggered
    sessionStorage.setItem("refreshFlag", "true");

    // Perform the page refresh
    window.location.reload();
  }


});
