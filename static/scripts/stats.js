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
    // console.log(jsonData)





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
        categories: ["F-14", "F-18", "Viggen", "Mig-29", "Eurofighter"],
        lineColor: '#000000', // Axis line color (black)
        labels: {
          style: {
            color: '#000000' // Axis label color (black)
          }
        }
      },
      yAxis: {
        min: 0, // Set the minimum value for the radial axis
        max: 1, // Set the maximum value for the radial axis
        gridLineColor: '#000000', // Grid line color (black)
        labels: {
          format: '{value:.0%}', // Display values as percentage
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
        const startingMMR = data[0].initial_mmr;
        const mmrChanges = data.map(entry => ({
          date: entry.date,
          change: entry.mmr_change
        }));
        // console.log("STARTING: ", startingMMR)
  
        let currentMMR = startingMMR;
        const mmrProgression = mmrChanges.map(entry => {
          currentMMR += entry.change;
          return [new Date(entry.date).getTime(), currentMMR];
        });
  
        // Create the chart
        Highcharts.chart('chart-container2', {
          chart: {
            type: 'line',
            backgroundColor: '#595f7e',
          },
          title: {
            text: 'MMR Progression Chart',
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
          },
          series: [{
            name: 'MMR Progression',
            data: mmrProgression,
            color: '#FF6B8A',
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





// ------------------------------------------------------------------------


// Retrieve the data from your database
const matches = [
  ['Player A', 'Player B', 112],
  ['Player A', 'Player C', 186],
  ['Player A', 'Player D', 82],
  ['Player A', 'Player E', 112],
  ['Player A', 'Player F', 134],
  ['Player A', 'Player G', 104],
  ['Player A', 'Player H', 118],
  ['Player A', 'Player I', 99],
  ['Player A', 'Player J', 163],
  ['Player A', 'Player K', 120],
  // Add more matches involving Player A here...
];



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