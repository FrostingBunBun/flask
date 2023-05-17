

document.addEventListener("DOMContentLoaded", function () {

    var toMaking = document.getElementById("toMaking");
    toMaking.addEventListener("click", function () {
    window.location.href = "/matchmaking";
    });

    var selectValue = document.getElementById("playerName1");
    selectValue.textContent = "{{ leftNAME }}";
    console.log(selectValue);


    

    
});
