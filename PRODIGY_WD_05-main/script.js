document.addEventListener('DOMContentLoaded', () => {
    const fetchWeatherButton = document.getElementById('fetch-weather');
    const fetchWeatherLocationButton = document.getElementById('fetch-weather-location');
    const locationInput = document.getElementById('location-input');
    const currentWeatherContainer = document.getElementById('current-weather-container');
    const forecastItemsContainer = document.getElementById('forecast-items');

    fetchWeatherButton.addEventListener('click', () => {
        const location = locationInput.value;
        if (location) {
            fetchWeather(location);
        } else {
            alert('Please enter a location');
        }
    });

    fetchWeatherLocationButton.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoordinates(latitude, longitude);
            }, error => {
                console.error('Error getting location:', error);
                alert('Failed to get your location. Please ensure location services are enabled.');
            });
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    });

    function fetchWeather(location) {
        const apiKey = '52ebda0ba8227c0f6ed20687726d9610';
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

        fetch(weatherUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Weather API request failed');
                }
                return response.json();
            })
            .then(data => {
                displayCurrentWeather(data);
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                alert('Failed to fetch weather data. Please try again.');
            });

        fetch(forecastUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Forecast API request failed');
                }
                return response.json();
            })
            .then(data => {
                displayForecast(data);
            })
            .catch(error => {
                console.error('Error fetching forecast data:', error);
                alert('Failed to fetch forecast data. Please try again.');
            });
    }

    function fetchWeatherByCoordinates(latitude, longitude) {
        const apiKey = '52ebda0ba8227c0f6ed20687726d9610';
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

        fetch(weatherUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Weather API request failed');
                }
                return response.json();
            })
            .then(data => {
                displayCurrentWeather(data);
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                alert('Failed to fetch weather data. Please try again.');
            });

        fetch(forecastUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Forecast API request failed');
                }
                return response.json();
            })
            .then(data => {
                displayForecast(data);
            })
            .catch(error => {
                console.error('Error fetching forecast data:', error);
                alert('Failed to fetch forecast data. Please try again.');
            });
    }

    function displayCurrentWeather(data) {
        const weatherIcon = getWeatherIcon(data.weather[0].icon);
        currentWeatherContainer.innerHTML = `
            <h2 class="mb-4">Today</h2>
            <div class="weather-info"><h4>${data.name}</h4></div>
            <div class="weather-info"><h1>${data.main.temp}°C</h1> </div>
            <div class="weather-info text-capitalize"><p>${data.weather[0].description} <i class="bi bi-${weatherIcon}"></i></p></div>
            <div class="weather-info"><p><strong>Humidity:</strong> ${data.main.humidity}%</p></div>
            <div class="weather-info"><p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p></div>
        `;
    }
    
    function displayForecast(data) {
        forecastItemsContainer.innerHTML = '';
        forecastItemsContainer.innerHTML += '<h2 class="mb-4 text-center">5-Day Forecast</h2>';
        const forecastList = data.list.filter(item => item.dt_txt.includes("12:00:00"));
    
        forecastList.forEach(forecast => {
            const date = new Date(forecast.dt_txt).toLocaleDateString();
            const temperature = forecast.main.temp;
            const description = forecast.weather[0].description;
            const weatherIcon = getWeatherIcon(forecast.weather[0].icon);
    
            const forecastItem = document.createElement('div');
            forecastItem.className = 'col-6 col-lg-3 col-md-4 mb-3';
            forecastItem.innerHTML = `
                <div class="forecast-items p-2 text-center shadow">
                    <p>${date}</p>
                    <p>${temperature} °C</p>
                    <p class="text-capitalize">${description} <i class="bi bi-${weatherIcon}"></i></p>
                </div>
            `;
            forecastItemsContainer.appendChild(forecastItem);
        });
    }
    
    function getWeatherIcon(iconCode) {
        const iconMap = {
            '01d': 'sun-fill',
            '01n': 'moon-stars-fill',
            '02d': 'cloud-sun-fill',
            '02n': 'cloud-moon-fill',
            '03d': 'cloud-fill',
            '03n': 'cloud-fill',
            '04d': 'clouds-fill',
            '04n': 'clouds-fill',
            '09d': 'cloud-drizzle-fill',
            '09n': 'cloud-drizzle-fill',
            '10d': 'cloud-rain-fill',
            '10n': 'cloud-rain-fill',
            '11d': 'cloud-lightning-fill',
            '11n': 'cloud-lightning-fill',
            '13d': 'snow-fill',
            '13n': 'snow-fill',
            '50d': 'fog-fill',
            '50n': 'fog-fill',
            '50d': 'haze-fill',
            '50n': 'haze-fill' 
        };
        return iconMap[iconCode] || 'cloud-sun';
    }
    

    // Auto-fetch weather on page load
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoordinates(latitude, longitude);
        }, error => {
            console.error('Error getting location:', error);
            alert('Failed to get your location. Please ensure location services are enabled.');
        });
    } else {
        alert('Geolocation is not supported by your browser.');
    }
});
