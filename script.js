const input = document.querySelector(".input");
const searchButton = document.querySelector(".searchButton");
const liveLocationButton = document.querySelector(".getLive");
const city = document.querySelector(".city");
const localTime = document.querySelector(".localTime");
const temp = document.querySelector(".temp");
const refreshButton = document.querySelector(".refreshButton");
const weatherForm = document.querySelector(".weatherForm");
const error = document.querySelector(".errorMsg");
const baseUrl = "http://api.weatherapi.com/v1/forecast.json";
const apiKey = "dd00ed59dcc54731b6e85238252504";
const weatherIcon = document.querySelector(".weatherIcon");

function failedToGet() {
    city.innerText = "";
    localTime.innerText = "";
    temp.innerText = "";
    error.innerText = "Invalid Input : No Such City ❌";
}

function handleEmptyInput() {
    error.innerText = "❓ Please Enter City Name";
}

refreshButton.addEventListener("click", () => {
    error.innerText = "";
    input.value = "";
    city.innerText = "City";
    localTime.innerText = "Local Time";
    temp.innerText = "Temperature";
    weatherIcon.style.display= "none";
});

searchButton.addEventListener("click", async () => {
    const cityName = input.value;
    if(cityName === "") {
        handleEmptyInput();
        return;
    }
    try {
        const result = await getData(cityName);
        weatherIcon.style.display = "block";
        error.innerText = "";
        city.innerText = `${result.location.name}, ${result.location.country}`;
        localTime.innerText = result.location.localtime;
        temp.innerText = `${result.current.temp_c}°C`;
        let isDay = result.current.is_day;
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
});

async function getData(city) {
    const promise = await fetch(`${baseUrl}?key=${apiKey}&q=${city}&aqi=yes`);
    return await promise.json();
}

liveLocationButton.addEventListener("click", () => {
    const result = navigator.geolocation.getCurrentPosition(gotLocation, handleError);
    city.innerText = `${result.location.name}, ${result.location.region} - ${result.location.country}`;
    localTime.innerText = result.location.localtime;
    temp.innerText = `${result.current.temp_c}C`;
});

async function getCurrData(lat, long) {
    try {
        const promise = await fetch(`${baseUrl}?key=${apiKey}&q=${lat},${long}&aqi=yes`);
        return await promise.json();
    }
    catch(error) {
        failedToGet();
    }
}

async function gotLocation(position) {
    const result = await getCurrData(position.coords.latitude, position.coords.longitude);
    console.log(result);
}

function handleError() {
    console.log("There is some issue");
}