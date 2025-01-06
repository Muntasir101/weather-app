const weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric";
const geocodingApiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=";
const apiKey = "eb94d4c29e11529ba1d8a292dcdc4197";

const weatherIconMap = {
    Clouds: "https://cdn-icons-png.flaticon.com/512/414/414927.png",
    Clear: "https://cdn-icons-png.flaticon.com/128/3222/3222800.png",
    Rain: "https://cdn-icons-png.flaticon.com/128/4088/4088981.png",
    Snow: "https://cdn-icons-png.flaticon.com/128/4724/4724107.png",
    Drizzle: "https://cdn-icons-png.flaticon.com/128/17908/17908045.png",
    Mist: "https://cdn-icons-png.flaticon.com/128/2930/2930127.png",
    Haze: "https://cdn-icons-png.flaticon.com/128/1779/1779807.png",
    Smoke : "https://cdn-icons-png.flaticon.com/128/10206/10206854.png",
    Thunderstorm: "https://cdn-icons-png.flaticon.com/128/116/116315.png",
    Fog: "https://cdn-icons-png.flaticon.com/128/1779/1779807.png",
    Sand: "https://cdn-icons-png.flaticon.com/128/10206/10206854.png",
    Ash: "https://cdn-icons-png.flaticon.com/128/10206/10206854.png",
    Squall: "https://cdn-icons-png.flaticon.com/128/10206/10206854.png",
    Tornado: "https://cdn-icons-png.flaticon.com/128/10206/10206854.png"

};

let map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let marker;

async function fetchWeatherByCoordinates(lat, lon) {
    try {
        const weatherResponse = await fetch(`${weatherApiUrl}&lat=${lat}&lon=${lon}&appid=${apiKey}`);
        const weatherData = await weatherResponse.json();

        document.getElementById('cityName').textContent = weatherData.name;
        document.getElementById('temperature').textContent = `${Math.round(weatherData.main.temp)}°C`;
        document.getElementById('humidity').textContent = `${weatherData.main.humidity}%`;
        document.getElementById('windSpeed').textContent = `${weatherData.wind.speed} km/h`;

        const weatherCondition = weatherData.weather[0].main;
        document.getElementById('condition').textContent = weatherCondition;
        document.getElementById('conditionIcon').src = weatherIconMap[weatherCondition] || "";

        if (marker) map.removeLayer(marker);
        marker = L.marker([lat, lon]).addTo(map);
        map.setView([lat, lon], 10);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("An error occurred while fetching weather data");
    }
}

async function searchCity() {
    const cityInput = document.getElementById('cityInput').value;

    try {
        const geoResponse = await fetch(`${geocodingApiUrl}${cityInput}&limit=1&appid=${apiKey}`);
        const geoData = await geoResponse.json();

        if (geoData.length === 0) {
            alert("City not found!");
            return;
        }

        const { lat, lon } = geoData[0];
        await fetchWeatherByCoordinates(lat, lon);
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while fetching data");
    }
}

document.getElementById('cityInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchCity();
});

window.onload = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoordinates(latitude, longitude);
            },
            (error) => {
                console.warn("Geolocation permission denied or unavailable:", error.message);
            }
        );
    } else {
        console.warn("Geolocation is not supported by this browser.");
    }
};
