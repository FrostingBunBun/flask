




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
                // var response = JSON.parse(xhr.responseText);
                // console.log(response.message);
                window.location.href = "/main"
                // Handle the response as needed
            } else {
                console.log('Error: ' + xhr.status);
                // Handle the error as needed
            }
        }
    };
    xhr.send(JSON.stringify({ 'key': key }));
});





var leaderBoardsBtn = document.getElementById("leaderboards");
leaderBoardsBtn.addEventListener("click", function() {
  // Redirect to the login page or perform necessary actions
  window.location.href = "/leaderboards";
});




const facts = [
    "Beyond Visual Range (BVR) combat involves engaging enemy aircraft outside of visual range using radar-guided missiles and advanced target tracking systems.",
    "Modern BVR missiles, such as the AIM-120 AMRAAM and the Russian R-77, have ranges of over 100 kilometers and can engage multiple targets simultaneously.",
    "Supermaneuverability is a characteristic of some advanced fighter aircraft that allows them to perform extreme maneuvers, such as Pugachev's Cobra or the Herbst maneuver.",
    "Thrust Vectoring Control (TVC) is a technology that allows fighter jets to direct the thrust of their engines to enhance maneuverability and control.",
    "Post-stall maneuvers, such as the Cobra maneuver or the Kulbit, involve intentionally stalling the aircraft to perform extraordinary maneuvers during aerial combat.",
    "Energy-maneuverability theory is a mathematical model used to evaluate and compare the performance and maneuvering capabilities of fighter aircraft.",
    "The Helmet-Mounted Display (HMD) is an advanced technology that provides pilots with essential flight data and target information projected onto their visors.",
    "Air Combat Maneuvering Instrumentation (ACMI) systems are used to track and analyze the performance of aircraft during simulated aerial combat training exercises.",
    "The OODA loop (Observe, Orient, Decide, Act) is a decision-making process that fighter pilots use to quickly assess and respond to changing combat situations.",
    "Dogfighting in a close-in visual range engagement is commonly referred to as 'furball,' where multiple aircraft are maneuvering in a confined airspace.",
    "Modern fighter aircraft, such as the F-22 Raptor and the Su-35, are equipped with highly advanced radar and sensor systems for situational awareness and target detection.",
    "Dissimilar Air Combat Training (DACT) involves training exercises where fighter pilots from different aircraft types simulate combat against each other to improve skills and tactics.",
    "The concept of 'Energy Bleed' refers to the loss of an aircraft's energy (speed and altitude) due to aggressive maneuvering, which can leave it vulnerable in combat.",
    "Infrared Search and Track (IRST) systems allow fighter aircraft to detect and track enemy aircraft based on their heat emissions, even without using radar.",
    "Advancements in stealth technology, such as radar-absorbent materials and shape optimization, have significantly reduced the radar cross-section of modern fighter aircraft.",
    "Modern Electronic Warfare (EW) systems, such as jamming and countermeasures, play a crucial role in enhancing survivability and disrupting enemy radar and missile systems.",
    "The ability to perform rapid and precise weapon employment, known as 'Weapon Delivery Accuracy,' is a critical skill for fighter pilots during combat engagements.",
    "The 'Hoerner wingtip' is a wingtip design that reduces drag and improves aerodynamic efficiency, commonly used in modern high-performance fighter aircraft.",
    "The concept of 'mutual support' involves maintaining situational awareness and communication with wingmen to effectively engage multiple enemy aircraft during a dogfight.",
    "Modern air-to-air combat often involves the use of 'data-link' systems that enable real-time sharing of sensor and targeting information between multiple aircraft.",
    "BFM stands for Basic Fighter Maneuvers, which are fundamental aerial combat maneuvers used by fighter pilots.",
    "The most basic BFM maneuver is the 'barrel roll,' which involves a 360-degree roll along the aircraft's longitudinal axis.",
    "The 'high yo-yo' is a BFM maneuver where the attacking aircraft trades altitude for airspeed to gain an advantageous position on the target.",
    "In BFM, the 'low yo-yo' is a maneuver where the attacking aircraft trades airspeed for altitude to regain energy and position for another attack.",
    "The 'lag pursuit' is a BFM tactic where the attacking aircraft maneuvers to follow the target aircraft but slightly behind its flight path.",
    "The 'lead pursuit' is a BFM tactic where the attacking aircraft maneuvers to follow the target aircraft but slightly ahead of its flight path.",
    "BFM includes defensive maneuvers like the 'break turn,' which involves a sudden and aggressive turn to evade an attacking aircraft.",
    "The 'chandelle' is a BFM maneuver where the aircraft performs a climbing turn while maintaining a constant airspeed and completing a 180-degree change in heading.",
    "In BFM, the 'pitchback' is a defensive maneuver where the defending aircraft reverses its turn direction to quickly change its flight path.",
    "The 'rolling scissors' is a BFM maneuver where two aircraft engage in a turning battle while attempting to gain a positional advantage.",
    "BFM involves mastering energy management, which includes understanding and controlling the aircraft's speed, altitude, and rate of climb.",
    "The 'nose-tail' maneuver is a BFM tactic where the defending aircraft maneuvers to keep its nose pointed at the attacking aircraft's tail.",
    "BFM requires situational awareness and the ability to make split-second decisions based on the enemy aircraft's position, speed, and intentions.",
    "The 'immelmann turn' is a BFM maneuver where the aircraft performs a half-loop followed by a half-roll to change direction.",
    "The 'split-S' maneuver is a defensive BFM maneuver where the aircraft performs a half-roll followed by a half-loop to quickly change direction and altitude.",
    "BFM involves understanding the aircraft's performance limitations, such as maximum turn rate, maximum sustained turn rate, and stall speed.",
    "The 'vertical displacement roll' is a BFM maneuver where the aircraft rolls and changes altitude while maintaining the same heading.",
    "BFM training is a critical component of fighter pilot education and focuses on developing the skills necessary to succeed in aerial combat.",
    "The 'low aspect gun pass' is a BFM tactic where the attacking aircraft uses its speed advantage to make a close-range gun attack on the target.",
    "BFM tactics and maneuvers have evolved over time with advancements in aircraft technology and changes in aerial combat strategies.",
    "The 'nose-high descending reversal' is a BFM maneuver where the aircraft performs a high-speed climb followed by a descending reversal to quickly change direction.",
  ];
  
  function changeFact() {
    const jetElement = document.getElementById('jet');
    const randomIndex = Math.floor(Math.random() * facts.length);
    jetElement.textContent = facts[randomIndex];
  
  }
  // maybe put it somewhere on the main pages, not sure if its a good idea
  changeFact();
  setInterval(changeFact, 10000);


// Get the element with the class "profile-username"
const profileUsernameElement = document.querySelector('.profile-username');
  
// Check if the element exists
if (profileUsernameElement) {
  // Get the text content of the element (which is "testAccount" in this case)
  const username = profileUsernameElement.textContent;
  console.log('Username:', username);
  fetchAvatar(username, 'profilePic');
} else {
  console.log('Element with class "profile-username" not found.');
}

function fetchAvatar(name, imageId) {
    fetch(`/left-avatar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `name=${name}`,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          // console.error(data.error);
          setDefaultAvatar(imageId);
        } else {
          const avatarUrl = data.avatar_url;
          const avatarImage = document.getElementById(imageId);
          avatarImage.src = avatarUrl;
        }
      })
      .catch((error) => {
        console.error(error);
        setDefaultAvatar(imageId);
      });
  }


// Get the modal element
const modal = document.getElementById("scrimModal");

// Get the button that opens the modal
const addScrimBtn = document.getElementById("addScrim");

// Get the date picker input element
const scrimDateInput = document.getElementById("scrimDate");

// Function to show the modal
function showModal() {
  modal.style.display = "block";
}

// Function to close the modal
function closeModal() {
  modal.style.display = "none";
}

// Event listener for the "ADD" button click

if (addScrimBtn) { // Check if the element exists
  addScrimBtn.addEventListener("click", showModal);
}


document.addEventListener("DOMContentLoaded", function () {
  const saveScrimButton = document.getElementById("saveScrim");

  if (saveScrimButton) {
    saveScrimButton.addEventListener("click", function () {
      const scrimDateInput = document.getElementById("scrimDate"); // Corrected ID
      const scrimTime = document.getElementById("scrimTime").value;
      const selectedTimezone = document.getElementById("timezoneSelect").value;
      const scrimDatetimeString = `${scrimDateInput.value}T${scrimTime}:00`;
      const selectedPlane = document.getElementById("planeSelect").value;

      // Make a POST request to the backend with the datetime and timezone
      fetch('/addScrim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scrim_datetime: scrimDatetimeString,
          timezone: selectedTimezone,
          plane: selectedPlane,
        }),
      })
      .then(response => response.json())
      .then(data => {
        console.log(data); // Response from the backend
        closeModal();
      })
      .catch(error => {
        console.error('Error:', error);
      });
    });
  }
});



  const cancelScrimButton = document.getElementById("cancelScrim");

  if (cancelScrimButton) { // Check if the element exists
    cancelScrimButton.addEventListener("click", function () {
      closeModal();
    });
  }




  document.addEventListener("DOMContentLoaded", function () {

    const scrimItems = document.querySelectorAll(".scrims-item");
  
    // Create an array to store elements and their scrimmage dates
    const scrimElements = [];
  
    // Iterate through the scrimItems and store their data in the array
    scrimItems.forEach(function (scrimItem) {
      const countdownElement = scrimItem.querySelector(".scrim-countdown");
      const scrimDateElement = scrimItem.querySelector(".scrim-date");
      const scrimmageDate = new Date(scrimDateElement.textContent).getTime();
  
      // Store the element and scrimmage date in the array
      scrimElements.push({
        element: scrimItem,
        scrimmageDate: scrimmageDate
      });
  
      function updateCountdown() {
        const now = new Date().getTime();
        const timeDifference = scrimmageDate - now;
  
        if (timeDifference > 0) {
          const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
  
          countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        } 
        else {
          countdownElement.innerHTML = "Scrim in progress";
        }
      }
  
      updateCountdown(); // Initial call to set the countdown immediately
      setInterval(updateCountdown, 1000); // Update the countdown every second
    });
  
    // Sort the scrimElements array based on the scrimmage dates
    scrimElements.sort(function (a, b) {
      return a.scrimmageDate - b.scrimmageDate;
    });
  
    // Get the parent container to append the sorted elements
    const parentContainer = document.querySelector(".scrims-list");
  
    // Append the sorted elements to the parent container
    scrimElements.forEach(function (scrimElement) {
      parentContainer.appendChild(scrimElement.element);
    });
  

    const removeButtons = document.querySelectorAll(".remove-button");

    removeButtons.forEach(function (removeButton) {
      removeButton.addEventListener("click", function () {
        const scrimItem = removeButton.closest(".scrims-item");
        const scrimId = scrimItem.querySelector(".scrim-name span:first-child").textContent;
  
        // Send an AJAX request to your Flask server to delete the scrim
        fetch(`/deleteScrim/${scrimId}`, {
          method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
          console.log(data); // Response from the backend
          scrimItem.remove(); // Remove the scrim item from the DOM
        })
        .catch(error => {
          console.error('Error:', error);
        });
      });
    });



  });
  