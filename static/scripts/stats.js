var homeBtn = document.getElementById("home");
homeBtn.addEventListener("click", function() {
    // Redirect to the login page or perform necessary actions
    window.location.href = "/main";
});

var backBtn = document.getElementById("back");
backBtn.addEventListener("click", function() {
    // Redirect to the login page or perform necessary actions
    window.location.href = "/leaderboards";
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
      // console.log("Checkbox is checked!");
      // Perform your desired action here when the checkbox is checked
    } else {
      // console.log("Checkbox is unchecked!");
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



// ===============================================


var nicknameElement = document.querySelector('.nickname');
var userProfileName = nicknameElement.textContent;

fetch('/planes_data/' + userProfileName)  // Include the name as a URL parameter
  .then(response => response.json())
  .then(data => {
    var jsonData = data;
    // console.log(userProfileName)






    Highcharts.chart('chart-container', {
      chart: {
        polar: true,
        backgroundColor: 'rgba(255, 255, 255, 0)' // Transparent background
      },
      title: {
        text: 'Most Played Planes',
        style: {
          color: '#000000' // Title color (black)
        }
      },
      pane: {
        background: {
          backgroundColor: 'rgba(255, 255, 255, 0.7)' // Pane background color (semi-transparent white)
        }
      },
      xAxis: {
        categories: ["F-14", "F-18", "Viggen", "Mig-29", "Eurofighter", "JAS_Gripen"],
        lineColor: '#000000', // Axis line color (black)
        labels: {
          style: {
            color: '#000000' // Axis label color (black)
          }
        }
      },
      yAxis: {
        // min: 0, // Set the minimum value for the radial axis
        max: 2, // Set the maximum value for the radial axis
        gridLineColor: '#000000', // Grid line color (black)
        labels: {
          enabled:false,
          // format: '{value:.0%}', // Display values as percentage
          style: {
            color: '#000000' // Axis label color (black)
          }
        }
      },
      plotOptions: {
        series: {
          color: '#ff2a8d', // Series color (orange)
          fillOpacity: 0.5 // Series fill opacity (semi-transparent)
        }
      },
      tooltip: {
        enabled: false // Disable tooltip
      },
      
      series: [{
        type: 'area',
        name: 'Game Count',
        data: jsonData.map(value => value / 20), // Scale the values to proportions (assuming 20 is the maximum count)
        pointPlacement: 'on'
      }],
      credits: {
        enabled: false // Disable credits
      }
    });





  })
  .catch(error => {
    console.error('Error:', error);
  });








  document.addEventListener('DOMContentLoaded', function() {
    const playerName = window.location.pathname.split('/').pop(); // Extract the player name from the URL
  
    fetch(`/progression/${playerName}`)
      .then(response => response.json())
      .then(data => {
        // Process the MMR data
        const startingMMR = 600; // Set the starting MMR to 600
        const mmrChanges = [];
        let currentMMR = startingMMR;
  
        data.forEach(entry => {
          const mmrChange = entry.mmr_change;
          if (mmrChange !== undefined) {
            currentMMR += mmrChange;
            mmrChanges.push({
              date: entry.date,
              change: currentMMR,
            });
          }
        });
  
        const mmrProgression = mmrChanges.map(entry => [
          new Date(entry.date).getTime(),
          entry.change,
        ]);
  
        // Calculate the true end MMR value
        const lastEntry = data[data.length - 1];
        const trueEndMMR = lastEntry['Current MMR'];
  
        // console.log('Last Entry:', lastEntry);
        // console.log('MMR Changes:', mmrChanges);
        // console.log('MMR Progression:', mmrProgression);
  
        // Adjust the last entry in mmrProgression to ensure it reaches the desired end MMR
        const lastProgressionEntry = mmrProgression[mmrProgression.length - 1];
        const lastDate = lastProgressionEntry[0];
        const newEndDate = lastDate + 24 * 60 * 60 * 1000; // Adding one day (in milliseconds)
        const endDateMMR = trueEndMMR;
        mmrProgression.push([newEndDate, lastProgressionEntry[1]]);
        mmrProgression.push([newEndDate, endDateMMR]);
  
        // Create the chart with the adjusted MMR progression
        Highcharts.chart('chart-container2', {
          chart: {
            type: 'line',
            backgroundColor: '#595f7e',
            zoomType: 'x', // Enable zooming on the x-axis
          },
          title: {
            text: 'MMR Progression Chart (interpolated beta)',
            style: {
              color: '#FF6B8A',
            },
          },
          xAxis: {
            type: 'datetime',
            title: {
              text: 'Date',
              style: {
                color: '#FF6B8A',
              },
            },
            labels: {
              style: {
                color: '#FFFFFF',
              },
            },
          },
          yAxis: {
            title: {
              text: 'MMR',
              style: {
                color: '#FF6B8A',
              },
            },
            labels: {
              style: {
                color: '#FFFFFF',
              },
            },
            min: 200, // Set the minimum value of the y-axis
            max: 1200, // Set the maximum value of the y-axis
          },
          series: [{
            name: 'MMR Progression',
            data: mmrProgression,
            color: '#FF6B8A',
            lineWidth: 2,
            connectNulls: true, // Connect the points even if there are gaps in the data
          }],
          credits: {
            enabled: false // Disable credits
          }
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  });












const profilePlayer = window.location.pathname.split('/').pop();

fetch('/getMatchesData', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ profilePlayer }),
})
  .then(response => response.json())
  .then(data => {
    const opponents = data.opponents;
    const averageDurations = data.averageDurations;

    const radarChart = document.getElementById('radarChart');

new Chart(radarChart, {
  type: 'radar',
  data: {
    labels: opponents,
    datasets: [
      {
        label: 'Average Duration',
        data: Object.values(averageDurations),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      r: {
        beginAtZero: true,
        suggestedMax: 40, // Adjust the maximum value based on your data
      },
    },
    elements: {
      line: {
        tension: 0.4, // Adjust the tension value (0 to 1) for smoother or sharper curves
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || '';
            return "VS " + label + ' Average Match Duration: ' + value + ' Seconds';
          },
        },
      },
    },
  },
});
})
.catch(error => {
  console.error('Error:', error);
});





var changePwdButton = document.getElementById('changePwd');
    var modalPwd = document.getElementById('myModalPwd');

    document.addEventListener('click', function(event) {
      if (event.target.matches('.change-pwd-button')) {
        modalPwd.style.display = 'block';
      }
    });
    
    
    // Close the modal when the user clicks outside the modal content
    window.addEventListener('click', function(event) {
      if (event.target === modalPwd) {
        modalPwd.style.display = 'none';
      }
    });
   

  
    // Handle form submission
    var form = document.querySelector('.modal-contentPwd form');
    // if (form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent the form from submitting

      // Get the values from the input fields
      var currentPwd = document.getElementById('currentPwd').value;
      var newPwd = document.getElementById('newPwd').value;
      var confirmPwd = document.getElementById('confirmPwd').value;

      // Get the current URL
      var url = window.location.href;

      // Extract the nickname from the URL using string manipulation
      var nickname = url.substring(url.lastIndexOf('/') + 1);


      // Send the password values to Python backend
      fetch('/process-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nickname: nickname,
          currentPwd: currentPwd,
          newPwd: newPwd,
          confirmPwd: confirmPwd
        })
      })
      .then(response => response.json())
      .then(data => {
        // Process the response from the Python backend
        console.log(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });




      // if (currentPwd == newPwd){
      //   console.log("SAME")
      // }
      // else{
      //   console.log("NOT SAME")
      // }

      // Add your change password logic here
      // Example: You can perform validation, make an API call, or update the password in your database

      // Clear the input fields
      document.getElementById('currentPwd').value = '';
      document.getElementById('newPwd').value = '';
      document.getElementById('confirmPwd').value = '';

      // Close the modal
      modalPwd.style.display = 'none';
    });
  // }



// Get all pagination links
var paginationLinks = document.querySelectorAll('.pagination a');

// Attach click event listener to each pagination link
paginationLinks.forEach(function(link) {
  link.addEventListener('click', function(e) {
    e.preventDefault(); // Prevent the default behavior of the anchor tag click event
    var page = this.getAttribute('href').split('=')[1];
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        document.querySelector('tbody').innerHTML = xhr.responseText;
      }
    };
    xhr.open('GET', '/stats/{{ name }}?page=' + page, true);
    xhr.send();
  });
});


