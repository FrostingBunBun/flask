var homeBtn = document.getElementById("home");
homeBtn.addEventListener("click", function() {
    // Redirect to the login page or perform necessary actions
    window.location.href = "/main";
});

var backBtn = document.getElementById("back");
backBtn.addEventListener("click", function() {
    // Redirect to the login page or perform necessary actions
    window.history.back();
});





function generateCalendar(year, month, gameData) {
    const calendar = document.getElementById("calendar");

    // Get the number of days in the current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Get the first day of the month (0 - Sunday, 1 - Monday, etc.)
    const firstDay = new Date(year, month, 1).getDay();

    // Create a table for the calendar
    const table = document.createElement("table");

    // Create table header with weekday names
    const headerRow = document.createElement("tr");
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    weekdays.forEach(function(weekday) {
        const th = document.createElement("th");
        th.textContent = weekday;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Calculate the number of rows needed for the calendar
    const numRows = Math.ceil((firstDay + daysInMonth) / 7);

    // Generate the calendar cells
    let day = 1;
    for (let i = 0; i < numRows; i++) {
        const row = document.createElement("tr");

        for (let j = 0; j < 7; j++) {
            const cell = document.createElement("td");

            if (i === 0 && j < firstDay) {
                // Empty cells before the first day of the month
                cell.textContent = "";
            } else if (day > daysInMonth) {
                // Empty cells after the last day of the month
                cell.textContent = "";
            } else {
                // Display the day number and game count
                cell.textContent = day;

                const gameCount = gameData[day - 1]; // Retrieve the game count for the day

                if (gameCount !== 0) {
                    const baseHue = 120; // Hue for slight green
                    const hueRange = 60; // Range of hues for transitioning from slight green to deep green
                    const saturationRange = 70; // Range of saturation for transitioning from slight green to deep green
                    const lightnessRange = 70; // Range of lightness for transitioning from slight green to deep green

                    // Calculate the hue based on the gameCount within the specified range
                    const hue = baseHue - (gameCount - 1) * (hueRange / (daysInMonth - 1));

                    // Ensure the hue stays within the green color range (0-120)
                    const adjustedHue = hue < 0 ? 0 : (hue > 120 ? 120 : hue);

                    // Calculate the saturation based on the gameCount within the specified range
                    const saturation = 30 + (gameCount * saturationRange / daysInMonth);

                    // Calculate the lightness based on the gameCount within the specified range
                    const lightness = 30 + (gameCount * lightnessRange / daysInMonth);

                    // Set the background color based on the adjusted hue, saturation, and lightness
                    cell.style.backgroundColor = `hsl(${adjustedHue}, ${saturation}%, ${lightness}%)`;

                }

                // Add the game count as a data attribute
                cell.dataset.games = gameCount;

                day++;
            }

            row.appendChild(cell);
        }

        table.appendChild(row);
    }

    // Remove any existing calendar and append the new one
    while (calendar.firstChild) {
        calendar.removeChild(calendar.firstChild);
    }
    calendar.appendChild(table);
}

// Replace gameData with your actual game count data
const gameData2 = [0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]; // Example game count data for each day
const gameDataString = document.getElementById("calendarData").textContent
const gameData = JSON.parse(gameDataString);
// console.log("TYPE: ", typeof(gameData))
// console.log("GAME DATA: ", gameData)
// Get the current year and month
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth();

// Generate the calendar for the current month
generateCalendar(currentYear, currentMonth, gameData);




function handleCheckboxChange() {
    var checkbox = document.getElementById("check-flag-checkbox");
    if (checkbox.checked) {
      console.log("Checkbox is checked!");
      // Perform your desired action here when the checkbox is checked
    } else {
      console.log("Checkbox is unchecked!");
      // Perform any actions you want when the checkbox is unchecked
    }
  }

  var applyBtns = document.getElementsByClassName("apply");
  for (var i = 0; i < applyBtns.length; i++) {
    applyBtns[i].addEventListener("click", function() {
      var checkbox = document.getElementById("check-flag-checkbox");
      var isChecked = checkbox.checked;
      
      // Create a data object to send to the server
    var data = {
        isPublic: isChecked
      };
  
      // Send an HTTP POST request to the server
      fetch('/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => {
        if (response.ok) {
          console.log('Checkbox value sent to the server successfully');
          // Handle the response from the server if needed
        } else {
          console.log('Error sending checkbox value to the server');
        }
      })
      .catch(error => {
        console.log('Error:', error);
      });
    });
  }