// var url = 
var APIkey = "900d88bf000b7690597af9bb6c4af0b0";
var serachBtn = document.querySelector('.searchBtn');
var mainCity = document.querySelector('.mainCity');
var mainTemp = document.querySelector('.mainTemp');
var mainWind = document.querySelector('.mainWind');
var mainHum = document.querySelector('.mainHum');
var mainUV = document.querySelector('.mainUV');



serachBtn.addEventListener('click', showResult);

function showResult() {
    var cityName = document.querySelector('.cityName').value;
    var url = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=" + APIkey;
    
    fetch(url)
    .then(function (response) {
        if (!response.ok) {
            throw response.json();
        }
        return response.json();
    })
    .then(function (data) {
        console.log(data);

        var lat = data[0].lat;
        var lon = data[0].lon;
        var name = data[0].name;
        getWeather(lat, lon, name)

});

}

function getWeather (lat, lon, name) {

    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=metric&appid=" + APIkey;
    console.log(apiUrl);
  
fetch(apiUrl)
    .then(function (response) {
        if (!response.ok) {
            throw response.json();
        }
        return response.json();
    })
    .then(function (data) {
        console.log(data);

    mainCity.textContent = name
    mainTemp.textContent = "Temperature: " + data.current.temp + " °C";
    mainWind.textContent = "Wind: " + data.current.wind_speed + " MPH";
    mainHum.textContent = "Humidity: " + data.current.humidity + " %";
    mainUV.textContent = "UV Index: " + data.current.uvi;

    for (var i = 1; i < 6; i++) {
        console.log(data.daily[i]);

        var day = moment.unix(data.daily[i].dt);

        var col = document.createElement("div");
        col.setAttribute("class", "col-md-2 p-3 mb-2 bg-info text-white infoBlock");
        var pDate = document.createElement("p");
        pDate.textContent = day.format("D/M/YYYY");
        col.appendChild(pDate);

        var pIcon = document.createElement("img");
        var iconcode = data.daily[i].weather[0].icon;
        console.log(iconcode);
        var iconurl = pIcon.setAttribute("src","https://openweathermap.org/img/wn/" + iconcode + "@2x.png");
        pIcon.textContent = iconurl;
        col.appendChild(pIcon);

        var pTemp = document.createElement("p");
        pTemp.textContent = "Temp: " + data.daily[i].temp.day + " °C";
        col.appendChild(pTemp);

        var pWind = document.createElement("p");
        pWind.textContent = "Wind: " + data.daily[i].wind_speed + " MPH";
        col.appendChild(pWind);

        var pHum = document.createElement("p");
        pHum.textContent = "Humidity: " + data.daily[i].humidity + " %";
        col.appendChild(pHum);

        document.querySelector(".forecast").appendChild(col);
    }

    });

}
