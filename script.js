let todayName = document.getElementById("today_date_day_name");
let todayNumber = document.getElementById("today_date_day_number");
let todayMonth = document.getElementById("today_date_month");
let todayLocation = document.getElementById("today_location");
let todayTemp = document.getElementById("today_temp");
let todayConditionImg = document.getElementById("today_condition_img");
let todayConditionText = document.getElementById("today_condition_text");
let humidity = document.getElementById("humidity");
let wind = document.getElementById("wind");
let windDirection = document.getElementById("wind_direction");
let nextDayName = document.getElementById("next_day_name");
let nextMaxTemp = document.getElementById("next_max_temp");
let nextMinTemp = document.getElementById("next_min_temp");
let nextConditionImg = document.getElementById("next_condition_img");
let nextConditionText = document.getElementById("next_condition_text");
let dayAfterTomorrowName = document.getElementById("day_after_tomorrow_name");
let dayAfterTomorrowMaxTemp = document.getElementById("day_after_tomorrow_max_temp");
let dayAfterTomorrowMinTemp = document.getElementById("day_after_tomorrow_min_temp");
let dayAfterTomorrowConditionImg = document.getElementById("day_after_tomorrow_condition_img");
let dayAfterTomorrowConditionText = document.getElementById("day_after_tomorrow_condition_text");

async function getWeatherData(cityName) {
    let apiKey = "1726222951b1401fbc4103415241906";
    let weatherResponse = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityName}&days=3`);
    let weatherData = await weatherResponse.json();
    return weatherData;
}

async function getConditionIcons() {
    let conditionResponse = await fetch("https://www.weatherapi.com/docs/conditions.json");
    let conditionData = await conditionResponse.json();
    return conditionData;
}

let conditionIcons;

async function fetchConditionIcons() {
    conditionIcons = await getConditionIcons();
}

function getConditionIcon(conditionCode) {
    let condition = conditionIcons.find(cond => cond.code === conditionCode);
    return condition ? condition.icon : null;
}

function displayTodayData(data) {
    todayLocation.innerHTML = data.location.name;
    todayTemp.innerHTML = data.current.temp_c;
    todayConditionImg.setAttribute("src", `https://${data.current.condition.icon}`);
    todayConditionText.innerHTML = data.current.condition.text;
    humidity.innerHTML = data.current.humidity + "%";
    wind.innerHTML = data.current.wind_kph + " km/h";
    windDirection.innerHTML = data.current.wind_dir;

    let today = new Date();
    todayName.innerHTML = today.toLocaleDateString("en-US", { weekday: "long" });
    todayNumber.innerHTML = today.getDate();
    todayMonth.innerHTML = today.toLocaleDateString("en-US", { month: "long" });
}

function displayNextData(data) {
    let forecastData = data.forecast.forecastday;
    let nextDate = new Date(forecastData[1].date);
    nextDayName.innerHTML = nextDate.toLocaleDateString("en-US", { weekday: "long" });
    nextConditionImg.setAttribute("src", `https://${forecastData[1].day.condition.icon}`); //show api icons
    nextMaxTemp.innerHTML = forecastData[1].day.maxtemp_c;
    nextMinTemp.innerHTML = forecastData[1].day.mintemp_c;
    nextConditionText.innerHTML = forecastData[1].day.condition.text;
}

function displayDayAfterTomorrowData(data) {
    let forecastData = data.forecast.forecastday;
    let dayAfterTomorrowDate = new Date(forecastData[2].date);
    dayAfterTomorrowName.innerHTML = dayAfterTomorrowDate.toLocaleDateString("en-US", { weekday: "long" });
    dayAfterTomorrowConditionImg.setAttribute("src", `https://${forecastData[2].day.condition.icon}`);
    dayAfterTomorrowMaxTemp.innerHTML = forecastData[2].day.maxtemp_c;
    dayAfterTomorrowMinTemp.innerHTML = forecastData[2].day.mintemp_c;
    dayAfterTomorrowConditionText.innerHTML = forecastData[2].day.condition.text;
}

async function startApp(city = "London") {
    let weatherData = await getWeatherData(city);
    if (!weatherData.error) {
        displayTodayData(weatherData);
        displayNextData(weatherData);
        displayDayAfterTomorrowData(weatherData);
    }
}

let searchInput = document.getElementById("search");
let searchButton = document.getElementById("search-button");

searchButton.addEventListener("click", function () {
    let city = searchInput.value.trim(); 
    if (city.length > 2) {
        startApp(city);
    }
});

searchInput.addEventListener("input", function () {
    let city = searchInput.value.trim(); 
    if (city.length > 2) {
        startApp(city);
    }
});

searchInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault(); 
        let city = searchInput.value.trim(); 
        if (city.length > 2) {
            startApp(city);
        }
    }
});

fetchConditionIcons().then(() => startApp());