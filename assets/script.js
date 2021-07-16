// Global variables

var apiKey = '&appid=b26059fbf296e0093c1075969aa0d13c';
var cityName = $('#searchWord').val();
var date = new Date();
var units = '&units=imperial';
var forecastDays = '&cnt=5';

// Function to add allow the enter key to kick off the search.
$('#searchWord').keypress(function(event) {

    if(event.keyCode ===13) {
        event.preventDefault();
        $('#searchBtn').click();
    }
});

// Event listener for the actuall search button.
$('#searchBtn').on('click', function(e) {
    e.preventDefault();
    $('forecastTitle').addClass('show');

    cityName = $('#searchWord').val();

    $('searchWord').val('');
    dailyWeather(cityName);
    currentForecast(cityName)
});

// Function to list the searched cities and append them to the page.
function listItems() {
    var cityStored = $('<li>').addClass('list-group-item').text(cityName);
    $('.list').append(cityStored);
}

// Function to get the current daily weather of the city searched.
function currentConditions(response) {
    var temp = (response.main.temp);
    temp = Math.floor(temp);
    
    // Empties the search bar
    $('#currentCity').empty();
    
    
    var card = $('<div>').addClass('card');
    var cardContent = $('<div>').addClass('card-content');
    var city = $('<h4>').addClass('card-head').text(response.name);
    var cityDate = $('<h4>').addClass('card-head').text(date.toLocaleString('en-US'));
    var temperature = $('<p>').addClass('card-body current-temp').text('Temperature: ' + temp + '℉');
    var humidity = $('<p>').addClass('card-body current-humidity').text('Humidity: ' + response.main.humidity + '%');
    var windMph = $('<p>').addClass('card-body current-wind').text('Wind Speed: ' + response.wind.speed + ' MPH');
    var weatherImage = $('<img>').attr('src', 'https://openweathermap.org/img/wn/' + response.weather[0].icon + '@4x.png');
    
    // Appending the data to the page.
    city.append(cityDate, weatherImage);
    cardContent.append(city, temperature, humidity, windMph,);
    card.append(cardContent);
    $('#currentCity').append(card);
}

// Function to call the API and run the functions
function dailyWeather(cityName) {
    var callApi = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + units + apiKey;

    $.ajax({
        url: callApi,
        method: 'GET'
    })
    .then(function(response){

        console.log(response);
        console.log(response.name);
        console.log(response.weather[0].icon);
        console.log(response.main.humidity);
        console.log(response.wind.speed);

        currentConditions(response);
        listItems();
    })    
}
// Function to get the uv index but I can't seem to get it to work.


function uvIndex(lat, lon) {
    $.ajax({
        type: "GET",
        url: "https://api.openweathermap.org/data/2.5/onecall?current.uvi&lat=" + lat + "&lon=" + lon + apiKey,
        dataType: "json",
        success: function(current) {
          var uv = $("<p>").text("UV Index: ");
          var btn = $("<span>").addClass("btn btn-sm").text(current.uvi);
          
          // change color depending on uv value
          if (current.uvi < 3) {
            btn.addClass("btn-success");
          }
          else if (current.uvi < 7) {
            btn.addClass("btn-warning");
          }
          else {
            btn.addClass("btn-danger");
          }
          
          $("#currentCity .card-body").append(uv.append(btn));
          console.log('hi this is ', current.uvi);
        }
    });
}

// function to get the 5day forecast
function currentForecast(cityName) {
    $('#forecast').empty();
    var queryUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + units + apiKey;
    $.ajax({
        url: queryUrl,
        method: 'GET'
    })
    
    // function with a 'for loop' to get teh 5 day weather responses and put them into an object
    .then(function (fiveDayResponse) {
        console.log(fiveDayResponse);
        var lon = fiveDayResponse.city.coord.lon;
        var lat = fiveDayResponse.city.coord.lat;
        
        for (let i = 0; i != fiveDayResponse.list.length; i+=8) {
            var cityObj = {
                date: fiveDayResponse.list[i].dt_txt,
                icon: fiveDayResponse.list[i].weather[0].icon,
                temp: fiveDayResponse.list[i].main.temp,
                humidity: fiveDayResponse.list[i].main.humidity,
            }
            var dateStr = cityObj.date;
            var trimDate = dateStr.substring(0, 10);
            var weatherImage = `https:///openweathermap.org/img/w/${cityObj.icon}.png`;
            forecastCard(trimDate, weatherImage, cityObj.temp, cityObj.humidity);

        }
        uvIndex(lat,lon);
    })
}

// function that passes the data in the object variable and adds class for the cards and information lines
function forecastCard(date, icon, temp, humidity) {
    
    var card = $("<div>").addClass("card col-md-2 ml-4 bg-primary text-white");
    var cardBody = $("<div>").addClass("card-body p-3 forecastBody")
    var cityDate = $("<h4>").addClass("card-title");
    var temperature = $("<p>").addClass("card-text forecastTemp");
    var humidityField = $("<span>").addClass("card-text forecastHumidity");
    var image = $("<img>").addClass('weather-icon');

    // appending the forcast data to the page
    $("#forecast").append(card);
    card.append(cardBody);
    cityDate.text(date);
    image.attr('src', icon);
    temperature.text(`Temp: ${temp} ℉`);
    humidityField.text(`Humidity: ${humidity}%`);
    cardBody.append(cityDate, image, temperature, humidityField);
}


    
