import React, { useState, useEffect } from "react";
import "./Weather.css";
import { WiHumidity, WiStrongWind } from "react-icons/wi";
import moment from "moment";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Link } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const API_KEY = "f2a531dc6e7857bfac5754f6879f0c30";

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [searchCity, setSearchCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState(""); // Added state for username

  // Sync username from localStorage on initial load
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("username");
    setUsername(""); // Update the state immediately
  };

  // Fetch weather based on user's current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
      },
      (error) => {
        setError("Unable to access location. Please click allow accessing your location or search a city here to see weather.");
      }
    );
  }, []);

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    setError(null); // Clear previous error when fetching new data
    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  
      const [weatherRes, forecastRes] = await Promise.all([fetch(weatherUrl), fetch(forecastUrl)]);
  
      const weatherData = await weatherRes.json();
      const forecastData = await forecastRes.json();
  
      setWeather(weatherData);
      processForecastData(forecastData);
      setError(null); // Clear error if data is retrieved successfully
    } catch (err) {
      setError("Error fetching weather data. Try again.");
    }
    setLoading(false);
  };

  const fetchWeatherByCity = async (city) => {
    if (!city) return;
    setLoading(true);
    setError(null); // Clear previous error when fetching new data
    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
  
      const [weatherRes, forecastRes] = await Promise.all([fetch(weatherUrl), fetch(forecastUrl)]);
  
      const weatherData = await weatherRes.json();
      const forecastData = await forecastRes.json();
  
      setWeather(weatherData);
      processForecastData(forecastData);
      setError(null); // Clear error if data is retrieved successfully
    } catch (err) {
      setError("City not found. Try another city.");
    }
    setLoading(false);
  };

  const processForecastData = (data) => {
    const dailyData = {};
    const hourlyData = []; // Store hourly forecast data

    data.list.forEach((item) => {
      const date = moment(item.dt_txt).format("YYYY-MM-DD");
      const hour = moment(item.dt_txt).format("HH:mm");

      if (!dailyData[date]) {
        dailyData[date] = { temp: [], weather: item.weather[0].description };
      }
      dailyData[date].temp.push(item.main.temp);

      // Collect hourly forecast data
      if (hourlyData.length < 24) { // Limit to 24 hours of forecast
        hourlyData.push({
          time: hour,
          temp: item.main.temp,
          weather: item.weather[0].description,
        });
      }
    });

    const forecastArray = Object.keys(dailyData).map((date) => ({
      date,
      temp: Math.round(dailyData[date].temp.reduce((a, b) => a + b) / dailyData[date].temp.length),
      weather: dailyData[date].weather,
    }));

    setForecast(forecastArray.slice(1, 6)); // Show 5-day forecast
    setHourlyForecast(hourlyData); // Set the 24-hour forecast data
  };

  // Prepare data for the 24-hour temperature graph
  const hourlyDataForGraph = {
    labels: hourlyForecast.map((hour) => hour.time), // Labels for X-axis (time)
    datasets: [
      {
        label: "",
        data: hourlyForecast.map((hour) => hour.temp), // Y-axis data (temperature)
        fill: false,
        borderColor: "rgb(4, 255, 255)", // Line color
        tension: 0.1,
      },
    ],
  };

  // Chart options with white color for text and grid
  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: '24-Hour Temperature Forecast',
        font: {
          size: 20,
          weight: 'bold',
          family: 'Arial, sans-serif',
        },
        color: 'rgb(255, 250, 250)',
      },
      tooltip: {
        backgroundColor: 'rgba(255, 212, 212, 0.8)', // Dark tooltip background
        titleColor: 'white',
        bodyColor: 'white',
      },
      legend: {
        display: false,  // Hide the legend
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'white',  // Make x-axis ticks white (time labels)
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.74)',  // Light grid lines to enhance visibility
        },
      },
      y: {
        ticks: {
          color: 'white',  // Make y-axis ticks white (temperature labels)
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',  // Light grid lines to enhance visibility
        },
      },
    },
  };

  return (
    <div className="weather-container">
      <nav>
        {username ? (
          <button
            className="login-link"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <Link to="/" className="login-link">Login</Link>
        )}
      </nav>

      <h1>{username ? `Welcome, ${username}!` : "Weather App"}</h1>
      <div className="search-box">
        <input
          type="text"
          placeholder="Enter city name..."
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
        />
        <button onClick={() => fetchWeatherByCity(searchCity)} id="s">Search</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <div className="scl">
        {weather && (
          <div className="weather-card">
            <h2>{weather.name}, {weather.sys?.country}</h2>
            <p>🌡️ {weather.main?.temp}°C (Feels like {weather.main?.feels_like}°C)</p>
            <p>☁️ {weather.weather?.[0]?.description}</p>
            <p><WiHumidity /> Humidity: {weather.main?.humidity}%</p>
            <p><WiStrongWind /> Wind Speed: {weather.wind?.speed} m/s</p>
          </div>
        )}

        {forecast.length > 0 && (
          <div className="forecast-container">
            <h3>5-Day Forecast</h3>
            <div className="forecast">
              {forecast.map((day, index) => (
                <div key={index} className="forecast-card">
                  <p>{moment(day.date).format("ddd, MMM D")}</p>
                  <p>🌡️ {day.temp}°C</p>
                  <p>☁️ {day.weather}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {hourlyForecast.length > 0 && (
          <div className="forecast24">
            <Line data={hourlyDataForGraph} options={chartOptions} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
