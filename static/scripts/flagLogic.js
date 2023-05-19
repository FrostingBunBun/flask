
function getFlag(nameCell) {

    var osea_from_ace_combat = []
    var india = [];
    var saudiarabia = [];
    var russia = ["Tosha", "Killlka", "FrostingBunBun"];
    var china = ["NON"];
    var egypt = []
    var germany = ["Ahri"]
    var united_states = ["Aglitter", "inuren", "Riko", "Razor", "7Eleven", "Angelofdemon602", "Bast1an037", "Cbanz77", "defenestrators", "DJ Moon", "Egg9", 
    "megaoz", "notevn3", "Okami_is_Dead", "Plot", "NoClueVR", "RACCOON_FACTS1", "Raptoritasha", "RETASU.JP", "SweetCandyAndy", "Xdjcarter", 
    "Gen Obvious", "-DJ-Cyber-"]
    var japEmpire = ["pkqk"]
    var canada = ["Chemists", "Ashentree", "Kaseymark7477", "Pickle", "BladeLupus"]
    var northkorea = ["CDRM13"]
    var norway = ["KitKat"]
    var singapore = ["Devious"]
    var puerto_rico = ["_Scrappy"]
    var south_africa = []
    var united_kinkdom = ["-Rega-"]
    var australia = []
    var new_zealand = ["VGJONO"]
    var confederate = ["fwood2", "lilRookie", "Mozzarella02"]
    var mexico = ["FuntimeVRGamer"]
    var france = ["Aijiro"]
    var ukraine = ["Deferwix", "Isida"]
    var italy = ["IPayd4WinRAR"]
    var netherlands = ["JensdeKock"]
    var indonesia = ["Avy"]
    var japan = ["Retatsu", "YuGo0327", "acaia626", "BambooPill", "ASkun", "Charlotte0205", "Iyoka", "miya 65759", "OCEAN2", "Yumemidori", "Watatsumi"]
    var philippines = ["Rekunance"]
    var lgbt = ["Prince-chan"]
    var nazi = ["Chippy"]
    var israel = ["SweetBaguette"]
    var pakistan = ["r3aper_13"]
    var ussr = []
    var taliban = ["General_Stoip"]
    var taiwan = ["THEE"]
    var iraq = ["DOCTOR_GOLFIE"]
    var naziItaly = ["TheBoysOfNan"]
    var eastIndiaComp = ["Rexrover"]
    var transportCanada = ["windshields"]
    var vietcong = ["K4ichi"]
    var fem = ["defenestrators"]
    var someGender = ["~Dj-Cyber~"]
    var kazakhstan = ["ramizfatt"]
    var air_canada = ["Patrick Bateman"]
    var palestine = ["haidarah"]
    var poland = ["Delfin"]
    var someZealand = ["Poly"]
  
  
  
  
  
    var flagScikidsPartial = "https://www.sciencekids.co.nz/images/pictures/flags96/";
    var osea_link_png = "https://upload.wikimedia.org/wikipedia/commons/8/80/High_resolution_Osean_national_flag.png"
    var flagPartialEnding = ".jpg";
    var flagWorld = "https://qph.cf2.quoracdn.net/main-qimg-0316609779aab2e9c5084cdd437dc429-lq";
    // var dmReaper = "https://i.ibb.co/VHBS18t/dmReaper.png"
    var dmReaper = "https://my.catgirls.forsale/TWbZj375.png"
    // var ss = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    // var row = ss.getCurrentCell().getRow();
    var confederateFlag_png = "https://www.adl.org/sites/default/files/styles/wide/public/images/combating-hate/hate-on-display/c/confederate-flag-1.jpg.webp?itok=rUJNUSNk"
    var japEmpire_png = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Naval_ensign_of_the_Empire_of_Japan.svg/1920px-Naval_ensign_of_the_Empire_of_Japan.svg.png"
    var lgbt_png = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Gay_Pride_Flag.svg/1920px-Gay_Pride_Flag.svg.png"
    var nazi_png = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Flag_of_Germany_%281935%E2%80%931945%29.svg/1920px-Flag_of_Germany_%281935%E2%80%931945%29.svg.png"
    var ussr_png = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Flag_of_the_Soviet_Union.svg/1920px-Flag_of_the_Soviet_Union.svg.png"
    var taliban_png = "https://cdn.discordapp.com/attachments/954995532814753812/1079966832997453824/Flag_of_the_Taliban.svg.png"
    var naziItaly_png = "https://cdn.discordapp.com/attachments/954995532814753812/1079970015052300388/Flag_of_Italy_1861-1946_crowned.svg.png"
    var eastIndiaComp_png = "https://cdn.discordapp.com/attachments/954995532814753812/1079970823185633340/Flag_of_the_British_East_India_Company_1801.svg.png"
    var transportCanada_png = "https://cdn.discordapp.com/attachments/954995532814753812/1080037862147366962/Untitled.png"
    var vietcong_png = "https://cdn.discordapp.com/attachments/954995532814753812/1081510712775544872/FNL_Flag.svg.png"
    var fem_png = "https://cdn.discordapp.com/attachments/954995532814753812/1081857143969427476/Pink_Venus_symbol.svg.png"
    var someGender_png = "https://cdn.discordapp.com/attachments/954995532814753812/1081857897102848030/Transgender_Pride_flag.svg.png"
    var air_canada_png = "https://cdn.discordapp.com/attachments/1082025405986385920/1082025448545976420/IthX8bu3PuOaPr7HfZx8IgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgvzf8T9iuI5dXblLjgAAAABJRU5ErkJggg.png"
    var poland_png = "https://en.wikipedia.org/wiki/Flag_of_Poland#/media/File:Flag_of_Poland.svg"
    var someZealand_png = "https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Fire_the_Lazer.svg/1200px-Fire_the_Lazer.svg.png"
  
    // var nameCell = ss.getRange(row, 4).getValue();

    nameCell = nameCell.split(" ");
    nameCell = nameCell[0];

    // console.log(nameCell);
    // =============================================
  
  
    // =============================================
  
    if(northkorea.includes(nameCell)){
      return flagScikidsPartial + "North_Korea" + flagPartialEnding
    }
    if(poland.includes(nameCell)){
      return flagScikidsPartial + "Poland" + flagPartialEnding
    }
    if(palestine.includes(nameCell)){
      return flagScikidsPartial + "Palestine" + flagPartialEnding
    }
    if(kazakhstan.includes(nameCell)){
      return flagScikidsPartial + "Kazakhstan" + flagPartialEnding
    }
    else if(united_kinkdom.includes(nameCell)){
      return flagScikidsPartial + "United_Kingdom" + flagPartialEnding
    }
    else if(new_zealand.includes(nameCell)){
      return flagScikidsPartial + "New_Zealand" + flagPartialEnding
    }
    else if(mexico.includes(nameCell)){
      return flagScikidsPartial + "Mexico" + flagPartialEnding
    }
    else if(philippines.includes(nameCell)){
      return flagScikidsPartial + "Philippines" + flagPartialEnding
    }
    else if(israel.includes(nameCell)){
      return flagScikidsPartial + "Israel" + flagPartialEnding
    }
    else if(iraq.includes(nameCell)){
      return flagScikidsPartial + "Iraq" + flagPartialEnding
    }
    else if(taiwan.includes(nameCell)){
      return flagScikidsPartial + "Taiwan" + flagPartialEnding
    }
    else if(japEmpire.includes(nameCell)){
      return japEmpire_png
    }
    else if(someZealand.includes(nameCell)){
      return someZealand_png
    }
    else if(air_canada.includes(nameCell)){
      return air_canada_png
    }
    else if(someGender.includes(nameCell)){
      return someGender_png
    }
    else if(fem.includes(nameCell)){
      return fem_png
    }
    else if(vietcong.includes(nameCell)){
      return vietcong_png
    }
    else if(transportCanada.includes(nameCell)){
      return transportCanada_png
    }
    else if(eastIndiaComp.includes(nameCell)){
      return eastIndiaComp_png
    }
    else if(naziItaly.includes(nameCell)){
      return naziItaly_png
    }
    else if(taliban.includes(nameCell)){
      return taliban_png
    }
    else if(ussr.includes(nameCell)){
      return ussr_png
    }
    else if(nazi.includes(nameCell)){
      return nazi_png
    }
    else if(lgbt.includes(nameCell)){
      return lgbt_png
    }
    else if(indonesia.includes(nameCell)){
      return flagScikidsPartial + "Indonesia" + flagPartialEnding
    }
    else if(pakistan.includes(nameCell)){
      return flagScikidsPartial + "Pakistan" + flagPartialEnding
    }
    else if(netherlands.includes(nameCell)){
      return flagScikidsPartial + "Netherlands" + flagPartialEnding
    }
    else if(italy.includes(nameCell)){
      return flagScikidsPartial + "Italy" + flagPartialEnding
    }
    else if(ukraine.includes(nameCell)){
      return flagScikidsPartial + "Ukraine" + flagPartialEnding
    }
    else if(france.includes(nameCell)){
      return flagScikidsPartial + "France" + flagPartialEnding
    }
    else if(australia.includes(nameCell)){
      return flagScikidsPartial + "Australia" + flagPartialEnding
    }
    else if(india.includes(nameCell)){
      return flagScikidsPartial + "India" + flagPartialEnding
    }
    else if(south_africa.includes(nameCell)){
      return flagScikidsPartial + "South_Africa" + flagPartialEnding
    }
    else if(puerto_rico.includes(nameCell)){
      return flagScikidsPartial + "Puerto_Rico" + flagPartialEnding
    }
    else if(singapore.includes(nameCell)){
      return flagScikidsPartial + "Singapore" + flagPartialEnding
    }
    else if(norway.includes(nameCell)){
      return flagScikidsPartial + "Norway" + flagPartialEnding
    }
    else if(osea_from_ace_combat.includes(nameCell)){
      return osea_link_png
    }
    else if(confederate.includes(nameCell)){
      return confederateFlag_png
    }
    else if(japan.includes(nameCell)){
      return flagScikidsPartial + "Japan" + flagPartialEnding
    }
    else if(canada.includes(nameCell)){
      return flagScikidsPartial + "Canada" + flagPartialEnding
    }
    else if(united_states.includes(nameCell)){
      return flagScikidsPartial + "United_States" + flagPartialEnding
    }
    else if(germany.includes(nameCell)){
      return flagScikidsPartial + "Germany" + flagPartialEnding
    }
    else if(saudiarabia.includes(nameCell)){
      return flagScikidsPartial + "Saudi_Arabia" + flagPartialEnding
    }
    else if(russia.includes(nameCell)){
      return flagScikidsPartial + "Russia" + flagPartialEnding
    }
    else if(china.includes(nameCell)){
      return flagScikidsPartial + "China" + flagPartialEnding
    }
    else if(egypt.includes(nameCell)){
      return flagScikidsPartial + "Egypt" + flagPartialEnding
    }
    else if(mexico.includes(nameCell)){
      return flagScikidsPartial + "Mexico" + flagPartialEnding
    }
    else{                               
      return dmReaper
    }
    }

    window.onload = function() {
  var names = document.getElementsByClassName("list-item");
  for (var i = 0; i < names.length; i++) {
    var name = names[i].innerText;
    var flagUrl = getFlag(name);

    // Create a new image element
    var img = document.createElement("img");
    img.src = flagUrl;
    img.style.maxWidth = "50px";
    img.style.maxHeight = "50px";
    img.style.float = "right";
    img.style.marginLeft = "10px";
    img.style.marginTop = "-5px";
    img.style.verticalAlign = "middle";
    img.style.transition = "transform 0.2s";

    // Add hover effect
    img.addEventListener("mouseenter", function() {
      this.style.transform = "scale(1.2)";
    });

    img.addEventListener("mouseleave", function() {
      this.style.transform = "scale(1)";
    });

    // Append the image to the list item
    names[i].appendChild(img);
  }
};
window.onload = function() {
  var names = document.getElementsByClassName("list-item");
  for (var i = 0; i < names.length; i++) {
    var name = names[i].innerText;
    var flagUrl = getFlag(name);

    // Create a new image element
    var img = document.createElement("img");
    img.src = flagUrl;
    img.style.maxWidth = "50px";
    img.style.maxHeight = "50px";
    img.style.float = "right";
    img.style.marginLeft = "10px";
    img.style.marginTop = "-5px";
    img.style.verticalAlign = "middle";
    img.style.transition = "transform 0.2s";

    // Add hover effect to the list item
    names[i].addEventListener("mouseenter", function() {
      this.style.transform = "scale(1.1)";
    });

    names[i].addEventListener("mouseleave", function() {
      this.style.transform = "scale(1)";
    });

    // Append the image to the list item
    names[i].appendChild(img);
  }
};


window.onload = function() {
    var names = document.getElementsByClassName("list-item");
    for (var i = 0; i < names.length; i++) {
      var name = names[i].innerText;
      var flagUrl = getFlag(name);
  
        // Create a new image element
        var img = document.createElement("img");
        img.src = flagUrl;
        img.style.maxWidth = "80px";
        img.style.maxHeight = "30px";
        img.style.float = "right";
        img.style.marginRight = "10px"; // Adjust the marginRight value to move the image
        img.style.marginTop = "-5px";
        img.style.verticalAlign = "middle";
        img.style.transition = "transform 0.2s";


      // Add hover effect
    img.addEventListener("mouseenter", function() {
        this.style.transform = "scale(1.7)";
      });
  
      img.addEventListener("mouseleave", function() {
        this.style.transform = "scale(1)";
      });

      // Add hover effect to the list item
names[i].addEventListener("mouseenter", function() {
    this.style.transform = "scale(1.1)";
    this.style.transition = "transform 0.1s";
  });
  
  names[i].addEventListener("mouseleave", function() {
    this.style.transform = "scale(1)";
    this.style.transition = "transform 0.1s";
  });
  
      // Add hover effect to the list item
      names[i].addEventListener("mouseenter", function() {
        this.style.transform = "scale(1.1)";
      });
  
      names[i].addEventListener("mouseleave", function() {
        this.style.transform = "scale(1)";
      });
  
      // Append the image to the list item
      names[i].appendChild(img);
    }
  };
  
  

      
      
      