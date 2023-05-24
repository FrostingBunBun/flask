// Get the button element
var logOutButton = document.getElementById('home');

    var homeBtn = document.getElementById("home");
    homeBtn.addEventListener("click", function() {
    // Redirect to the login page or perform necessary actions
    window.location.href = "/main";
    
});



document.addEventListener("DOMContentLoaded", function() {
    var mmrValues = Array.from(document.querySelectorAll("#mmrTable .mmr-value")).map(element => parseInt(element.textContent));
    console.log("##############################")
    console.log(mmrValues)
    console.log("##############################")
  
    var mmrDistribution = {};

// Define the range increment
var rangeIncrement = 30;

// Calculate the distribution
for (var i = 0; i < mmrValues.length; i++) {
  var mmr = mmrValues[i];
  var range = Math.floor(mmr / rangeIncrement) * rangeIncrement;

  if (range in mmrDistribution) {
    mmrDistribution[range]++;
  } else {
    mmrDistribution[range] = 1;
  }
}

// Sort the distribution by keys in ascending order
var sortedKeys = Object.keys(mmrDistribution).sort(function(a, b) {
  return a - b;
});

// Create the labels and data arrays
var labels = [];
var data = [];

// Iterate through the sorted keys to populate the labels and data arrays
for (var j = 0; j < sortedKeys.length; j++) {
  var key = sortedKeys[j];
  labels.push(key + "-" + (parseInt(key) + rangeIncrement - 1));
  data.push(mmrDistribution[key]);
}

var ctx = document.getElementById("myChart").getContext("2d");

var chartData = {
  labels: labels,
  datasets: [
    {
      label: "MMR Distribution",
      data: data,
      
      borderColor: 'rgba(231, 84, 128, 1)',
      backgroundColor: 'rgba(231, 84, 128, 0.2)',
      borderWidth: 2,
      tension: 0.4,
    },
  ],
};

var options = {
    scales: {
      x: {
        title: {
          display: true,
          text: "MMR Range",
          font: {
            weight: "bold",
            size: 14,
            family: "Arial, sans-serif",
          },
        },
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.1)",
          borderDash: [4, 4],
        },
        ticks: {
          font: {
            size: 12,
            family: "Arial, sans-serif",
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Players",
          font: {
            weight: "bold",
            size: 14,
            family: "Arial, sans-serif",
          },
        },
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.1)",
          borderDash: [4, 4],
        },
        ticks: {
          font: {
            size: 12,
            family: "Arial, sans-serif",
          },
          beginAtZero: true,
          precision: 0,
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: "MMR Distribution Chart",
        font: {
          weight: "bold",
          size: 16,
          family: "Arial, sans-serif",
        },
      },
      legend: {
        display: false,
      },
    },
  };
  

    var myChart = new Chart(ctx, {
  type: "line",
  data: chartData,
  options: options,
});
  
  });



  