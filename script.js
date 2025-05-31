const input = document.querySelector(".input");
const searchButton = document.querySelector(".searchButton");
const getLocation = document.querySelector(".getLocationButton");
const city = document.querySelector(".city");
const localTime = document.querySelector(".localTime");
const temp = document.querySelector(".temp");
const refreshButton = document.querySelector(".refreshButton");
const weatherForm = document.querySelector(".weatherForm");
const error = document.querySelector(".errorMsg");
const baseUrl = "http://api.weatherapi.com/v1/forecast.json";
const apiKey = "dd00ed59dcc54731b6e85238252504";
const weatherIcon = document.querySelector(".weatherIcon");
const spinner = document.querySelector(".loader");
const content = document.querySelector(".content");

function showSpinner() {
    content.style.display = "none";
    spinner.style.display = "block";
}

function hideSpinner() {
    content.style.display = "block";
    spinner.style.display = "none";
}

function failedToGet() {
    city.innerText = "";
    localTime.innerText = "";
    temp.innerText = "";
    error.innerText = "There is some issue while fetching your location";
}

function handleEmptyInput() {
    error.innerText = "❓Please Enter City Name";
}

refreshButton.addEventListener("click", () => {
    hideSpinner();
    error.innerText = "";
    input.value = "";
    city.innerText = "City";
    localTime.innerText = "Local Time";
    temp.innerText = "Temperature";
    weatherIcon.style.display= "none";
});

searchButton.addEventListener('click', async () => {
    showSpinner();
    const cityName = input.value;
    if(cityName === "") {
        handleEmptyInput();
        setTimeout(hideSpinner, 500);
        return;
    }
    try {
        const result = await getData(cityName);
        weatherIcon.style.display = "block";
        error.innerText = "";
        city.innerText = `${result.location.name}, ${result.location.country}`;
        localTime.innerText = result.location.localtime;
        temp.innerText = `${result.current.temp_c}°C`;
        const isDay = result.current.is_day;
        if(isDay == 1) {
            weatherIcon.src = `${result.forecast.forecastday[0].day.condition.icon}`;
        }
        else {
            weatherIcon.src = "night_icon2.png";
        }
    }
    catch(e) {
        failedToGet();
    }
    finally {
        hideSpinner();
    }
});

async function getData(city) {
    const promise = await fetch(`${baseUrl}?key=${apiKey}&q=${city}&aqi=yes`);
    return await promise.json();
}

getLocation.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(gotLocation, handleError);
});

async function getCurrData(lat, long) {
    const promise = await fetch(`${baseUrl}?key=${apiKey}&q=${lat},${long}&aqi=yes`);
    return await promise.json();
}

async function gotLocation(position) {
    showSpinner();
    try {
        const result = await getCurrData(position.coords.latitude, position.coords.longitude);
        weatherIcon.style.display = "block";
        city.innerHTML = `${result.location.name}, ${result.location.country}`;
        localTime.innerText = result.location.localtime;
        temp.innerText = `${result.current.temp_c}°C`;
        const isDay = result.current.is_day;
        if(isDay == 1) {
            weatherIcon.src = `${result.forecast.forecastday[0].day.condition.icon}`;
        }
        else {
            weatherIcon.src = "night_icon2.png";
        }
    } 
    catch (error) {
        failedToGet();   
    }
    finally {
        hideSpinner();
    }
}