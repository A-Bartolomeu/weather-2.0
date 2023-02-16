function formatDate(timestamp) {
  let date = new Date(timestamp);
  let day = date.getDate();
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let year = date.getFullYear();
  let dayIndex = date.getDay();

  let weekDay = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let week = weekDay[dayIndex];

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[date.getMonth()];
  return `${week} | ${day} ${month} ${year} | ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let weekDay = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[weekDay];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  delete forecast[0];
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col">
        <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
          <img
           class="img-forecast"
           src="src/img/forecast/${forecastDay.weather[0].icon}.png"
           alt=""
           width="45"
          />
          <div class="weather-forecast-temperatures">
           <span class="weather-forecast-temperature-max">
           <i class="fa-solid fa-caret-up"></i>${Math.round(
             forecastDay.temp.max
           )}°</span>
           <span class="weather-forecast-temperature-min">
           <i class="fa-solid fa-caret-down"></i>${Math.round(
             forecastDay.temp.min
           )}°</span>
        </div>
      </div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "6bfa54f242cbb59343d4e58db578dc61";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");
  let temperatureMin = document.querySelector("#mintemperature");
  let temperatureMax = document.querySelector("#maxtemperature");

  celsiusTemperature = response.data.main.temp;
  maxCelsiusTemperature = response.data.main.temp_max;
  minCelsiusTemperature = response.data.main.temp_min;

  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  dateElement.innerHTML = formatDate(
    (response.data.dt + response.data.timezone) * 1000
  );
  iconElement.setAttribute(
    "src",
    `src/img/${response.data.weather[0].icon}.gif`
  );
  iconElement.setAttribute("alt", response.data.weather[0].icon);
  temperatureMin.innerHTML = Math.round(minCelsiusTemperature);
  temperatureMax.innerHTML = Math.round(maxCelsiusTemperature);

  getForecast(response.data.coord);
}

function search(city) {
  let apiKey = "6bfa54f242cbb59343d4e58db578dc61";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  let temperatureMax = document.querySelector("#maxtemperature");
  let temperatureMin = document.querySelector("#mintemperature");

  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheiTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheiTemperature);
  let maxFahrenheiTemperature = (maxCelsiusTemperature * 9) / 5 + 32;
  temperatureMax.innerHTML = Math.round(maxFahrenheiTemperature);
  let minFahrenheiTemperature = (minCelsiusTemperature * 9) / 5 + 32;
  temperatureMin.innerHTML = Math.round(minFahrenheiTemperature);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  let temperatureMax = document.querySelector("#maxtemperature");
  temperatureMax.innerHTML = Math.round(maxCelsiusTemperature);
  let temperatureMin = document.querySelector("#mintemperature");
  temperatureMin.innerHTML = Math.round(minCelsiusTemperature);
}
function searchLocation(position) {
  let apiKey = "6bfa54f242cbb59343d4e58db578dc61";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  axios.get(url).then(displayTemperature);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let celsiusTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

let currentLocationButton = document.querySelector("#location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

search("Lisbon");
