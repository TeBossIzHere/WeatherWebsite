function linkedinButton() {
  window.open("https://www.linkedin.com/in/muzaffer-ozen/", "_blank").focus();
}

function gitHubButton() {
  window.open("https://github.com/TeBossIzHere/WeatherWebsite", "_blank").focus();
}
function wcButton() {
  window.open("https://weather.com/", "_blank").focus();
}

function ufButton() {
  window.open("https://www.weather.gov/forecastmaps", "_blank").focus();
}

function sButton() {
  window.open("https://www.weather.gov/lmk/weathersafetyrules", "_blank").focus();
}

function openSettings() {
  $("#Settings").addClass("active");
  $("#overlay").addClass("active");
}

function closeSettings() {
  $("#Settings").removeClass("active");
  $("#overlay").removeClass("active");
}

if (localStorage.getItem("unit") === null) { localStorage.setItem("unit", "Unit: Imperial"); }
document.getElementById("switchUnitButton").innerHTML = localStorage.getItem("unit");
let buttonUnit = document.getElementById("switchUnitButton").innerHTML;
if (buttonUnit === "Unit: Imperial") { buttonUnit = "Imperial" } else if (buttonUnit === "Unit: Metric") { buttonUnit = "Metric" };

function switchUnitFunction() {
  let button = document.getElementById("switchUnitButton");
  if (localStorage.getItem("unit") === "Unit: Imperial") {
    button.innerHTML = "Unit: Metric";
    localStorage.setItem("unit", "Unit: Metric");
    document.location.reload(true);
  } else {
    button.innerHTML = "Unit: Imperial";
    localStorage.setItem("unit", "Unit: Imperial");
    document.location.reload(true);
  }
}

// _______________________________________________________________________________

let boxCount = 0;
if (localStorage.getItem("boxcount") === null) {
  clearCacheFunction();
}
if (localStorage.getItem("boxcount") !== "0") {
  boxCount = parseInt(localStorage.getItem("boxcount"));
}

let boxNames = [];
if (JSON.parse(localStorage.getItem("boxnames")) !== null) {
  boxNames = JSON.parse(localStorage.getItem("boxnames"));
}

createSite();

// _______________________________________________________________________________

// Current Location request
// localStorage.setItem("currentlocationused", "false");
// console.log(localStorage.getItem("currentlocationused"));
if (localStorage.getItem("currentlocationused") === null || localStorage.getItem("currentlocationused") === "false") {
  addCurrentLocation();
}
// _______________________________________________________________________________

function clearCacheFunction() {
  let boxNames = [];
  localStorage.setItem("boxcount", "0");
  localStorage.setItem("boxnames", JSON.stringify(boxNames));
  document.location.reload(true);
}

function addCityFunction() {
  let newArea = $("#newCityInput").val();
  boxCount = boxCount + 1;
  boxNames[boxCount - 1] = newArea;
  localStorage.setItem("boxcount", boxCount.toString());
  localStorage.setItem("boxnames", JSON.stringify(boxNames));
  document.location.reload(true);
}

function addCurrentLocation() {
  $.ajax({
    url: "https://geolocation-db.com/jsonp",
    jsonpCallback: "callback",
    dataType: "jsonp",
    success: function (location) {
      boxCount = parseInt(localStorage.getItem("boxcount"));
      boxCount = boxCount + 1;
      boxNames[boxCount - 1] = location.city;
      localStorage.setItem("boxcount", boxCount.toString());
      localStorage.setItem("boxnames", JSON.stringify(boxNames));
      localStorage.setItem("currentlocationused", "true");
      document.location.reload(true);
    }
  });
}

//Make it so if its night time the linear gradient for background is darker, and lighter for day time.
function descriptionWeather(backgroundName, value) {
  let code = Math.round(value / 100);
  if (code === 2 || code === 3 || code === 5 || value === 801 || value === 802 || value === 803 || value === 804) {
    document.getElementById(backgroundName).style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://i.imgur.com/IvyWDeU_d.webp?maxwidth=760&fidelity=grand)";
  } else if (code === 6) {
    document.getElementById(backgroundName).style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), url(https://i.imgur.com/TAScAvF_d.webp?maxwidth=760&fidelity=grand)"
  } else if (code === 7) {
    document.getElementById(backgroundName).style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), url(https://i.imgur.com/rjCaCTm_d.webp?maxwidth=760&fidelity=grand)"
  } else {
    document.getElementById(backgroundName).style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0,0.15)), url(https://i.imgur.com/qpWlAPX_d.webp?maxwidth=760&fidelity=grand)";
  }
}

async function createSite() {
  for (let i = 0; i < boxCount; i++) {
    await fetch("https://api.openweathermap.org/data/2.5/weather?q=" + boxNames[i] + "&units=" + buttonUnit + "&appid=3a501e6885616ae5a4ffdefeb17a61af")
      .then(response => response.json())
      .then(data => {
        let temp = data['main']['temp'];
        // let nameValue = data['name'];
        let descValue = data['weather'][0]['id'];
        let descName = data['weather'][0]['description'];
        let tempMax = data['main']['temp_max'];
        let tempMin = data['main']['temp_min'];
        $("#boxContainer").append('<div id="box' + i + '">');
        $("#box" + i + "").append('<p id="name' + i + '" style="font-size: 25px;margin:0;">' + boxNames[i] + '</p>');
        $("#box" + i + "").append('<p id="temp' + i + '" style="font-size: 75px;margin:0;">' + Math.round(temp) + '°</p>');
        $("#box" + i + "").append('<p id="desc' + i + '" style="margin-bottom:0;margin-top:50px;">' + descName + '</p>');
        $("#box" + i + "").append('<p id="HighLow' + i + '" style="font-size: 25px;margin:0;"><b>H: ' + Math.round(tempMax) + '°  L: ' + Math.round(tempMin) + '°</b></p>');
        descriptionWeather('box' + i + '', descValue);
        $("#box" + i + "").css({
          "background-color": "#a9d6e5",
          "display": "flex",
          "align-items": "center",
          "justify-content": "center",
          "text-align": "center",
          "background-size": "cover",
          "flex-direction": "column",
          "height": "35vh",
          "padding": "10px",
        });
        // $("#box" + i + "").insertBefore('#boxContainer #addNewCity');
      });
  }
}
