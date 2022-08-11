var APIkey = "900d88bf000b7690597af9bb6c4af0b0";
var serachBtn = document.querySelector('.searchBtn');
var mainCity = document.querySelector('.mainCity');
var mainTemp = document.querySelector('.mainTemp');
var mainWind = document.querySelector('.mainWind');
var mainHum = document.querySelector('.mainHum');
var mainUV = document.querySelector('.mainUV');
// gets info from local storage or empty array
var cityHistory = JSON.parse(localStorage.getItem("history")) || [];

// makes search button responsive
serachBtn.addEventListener('click', showResult);


function showResult() {
    var cityName = document.querySelector('.cityName').value;
    // runs cityHistory in array and gives an index (or -1 if not in an array)
    if (cityHistory.indexOf(cityName) === -1) {
        // if new city entered will add into array
        cityHistory.push(cityName);
        localStorage.setItem("history", JSON.stringify(cityHistory));
    }

    for (var i = 0; i < cityHistory.length; i++) {

        //creates buttons with previously searched cities
        var searchList = document.createElement("button");
        searchList.setAttribute("class", "col-md-12 p-3 mb-2 bg-light text-dark rounded-pill");
        searchList.textContent = cityHistory[i];
        searchList.setAttribute("value", cityHistory[i]);
        // make buttins responsive and returns previous info
        searchList.onclick = function () {
            getGeo(this.value);
        }
        document.querySelector(".searchHist").appendChild(searchList);

    }

    getGeo(cityName);
}

function getGeo(city) {

    var url = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + APIkey;
    // fetch request gets an info of the geolocation 
    fetch(url)
        .then(function (response) {
            // generates an error if status is not ok
            if (!response.ok) {
                throw response.json();
            }
            return response.json();
        })
        .then(function (data) {

            //picks up latitude, longitude and city name
            var lat = data[0].lat;
            var lon = data[0].lon;
            var name = data[0].name;

            getWeather(lat, lon, name);

        });
}


function getWeather(lat, lon, name) {

    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=metric&appid=" + APIkey;
    // fetch request gets an info about the weather
    fetch(apiUrl)
        .then(function (response) {
            if (!response.ok) {
                throw response.json();
            }
            return response.json();
        })
        .then(function (data) {

            // creates main weather card
            mainCity.textContent = name
            mainTemp.textContent = "Temperature: " + data.current.temp + " °C";
            mainWind.textContent = "Wind: " + data.current.wind_speed + " MPH";
            mainHum.textContent = "Humidity: " + data.current.humidity + " %";
            mainUV.textContent = "UV Index: " + data.current.uvi;

            // setting parent element to empty string
            document.querySelector(".forecast").innerHTML = ""

            // loop over the data to generate a weather cards for five days
            for (var i = 1; i < 6; i++) {

                // creates 'div' element
                var col = document.createElement("div");
                col.setAttribute("class", "col-md-2 p-3 mb-2 bg-info text-white infoBlock");

                // creates 'p' elemet with date info
                var pDate = document.createElement("p");
                var day = moment.unix(data.daily[i].dt);
                pDate.textContent = day.format("dddd, MMMM Do YYYY");
                col.appendChild(pDate);

                // creates 'img' elemet with icon
                var pIcon = document.createElement("img");
                var iconcode = data.daily[i].weather[0].icon;
                var iconurl = pIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + iconcode + "@2x.png");
                pIcon.textContent = iconurl;
                col.appendChild(pIcon);

                // creates 'p' elemet with temperature info
                var pTemp = document.createElement("p");
                pTemp.textContent = "Temp: " + data.daily[i].temp.day + " °C";
                col.appendChild(pTemp);

                // creates 'p' elemet with wind info
                var pWind = document.createElement("p");
                pWind.textContent = "Wind: " + data.daily[i].wind_speed + " MPH";
                col.appendChild(pWind);

                // creates 'p' elemet with humidity info
                var pHum = document.createElement("p");
                pHum.textContent = "Humidity: " + data.daily[i].humidity + " %";
                col.appendChild(pHum);

                // appends 'div' to the page
                document.querySelector(".forecast").appendChild(col);
            }



        });

}





