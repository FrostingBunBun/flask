window.addEventListener("DOMContentLoaded", function () {
  var statsButton = document.getElementById("login");
  statsButton.addEventListener("click", function () {
    window.location.href = "login";
  });
});

window.addEventListener("DOMContentLoaded", function () {
  var statsButton = document.getElementById("register");
  statsButton.addEventListener("click", function () {
    window.location.href = "register";
  });
});


// var leaderBoardsBtn = document.getElementById("leaderboards");
// leaderBoardsBtn.addEventListener("click", function() {
//   // Redirect to the login page or perform necessary actions
//   window.location.href = "/leaderboards";
// });

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
  const jetElement = document.getElementById("jet");
  const randomIndex = Math.floor(Math.random() * facts.length);
  jetElement.textContent = facts[randomIndex];
}
// maybe put it somewhere on the main pages, not sure if its a good idea
changeFact();
setInterval(changeFact, 10000);
