
// Weather API functionality
async function getWeather() {
  const city = document.getElementById('cityInput').value.trim();
  const weatherDisplay = document.getElementById('weatherDisplay');
  
  if (!city) {
    weatherDisplay.innerHTML = '<p style="color: red;">Please enter a city name</p>';
    return;
  }

  weatherDisplay.innerHTML = '<p>Loading weather data...</p>';

  try {
    // Get API key from backend endpoint
    const keyResponse = await fetch('/api/weather-key');
    const keyData = await keyResponse.json();
    
    if (!keyData.apiKey) {
      throw new Error('API key not configured');
    }

    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${keyData.apiKey}&units=metric`);
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API key - please check your OpenWeatherMap API key');
      } else if (response.status === 404) {
        throw new Error('City not found - please check the city name');
      } else {
        throw new Error('Weather data not available');
      }
    }

    const data = await response.json();
    
    weatherDisplay.innerHTML = `
      <h3>Weather in ${data.name}, ${data.sys.country}</h3>
      <p>Temperature: ${Math.round(data.main.temp)}°C</p>
      <p>Condition: ${data.weather[0].description}</p>
      <p>Feels like: ${Math.round(data.main.feels_like)}°C</p>
      <p>Humidity: ${data.main.humidity}%</p>
      <p>Wind: ${Math.round(data.wind.speed * 3.6)} km/h</p>
      <p><small>Live weather data from OpenWeatherMap</small></p>
    `;

    // Store current weather for mood logging
    window.currentWeather = {
      city: data.name,
      temp: Math.round(data.main.temp),
      condition: data.weather[0].description,
      country: data.sys.country
    };

  } catch (error) {
    console.error('Weather API Error:', error);
    weatherDisplay.innerHTML = `
      <p style="color: red;">Error: ${error.message}</p>
      <p><small>Please make sure you have set up your OpenWeatherMap API key in Secrets</small></p>
    `;
  }
}

// Mood logging functionality
function logMood() {
  const moodSelect = document.getElementById('moodInput');
  const moodFeedback = document.getElementById('moodFeedback');
  const selectedMood = moodSelect.value;

  if (!selectedMood) {
    moodFeedback.innerHTML = '<p style="color: red;">Please select a mood first!</p>';
    return;
  }

  // Create mood entry
  const moodEntry = {
    mood: selectedMood,
    timestamp: new Date().toLocaleString(),
    weather: window.currentWeather ? `${window.currentWeather.temp}°C, ${window.currentWeather.condition}` : 'Unknown'
  };

  // Get existing mood history
  let moodHistory = JSON.parse(localStorage.getItem('moodHistory') || '[]');
  
  // Add new entry
  moodHistory.push(moodEntry);
  
  // Save to localStorage
  localStorage.setItem('moodHistory', JSON.stringify(moodHistory));

  // Show feedback
  moodFeedback.innerHTML = `<p style="color: green;">Mood logged: ${selectedMood} ✓</p>`;
  
  // Reset selection
  moodSelect.value = '';
  
  // Update displays
  updateMoodList();
  updateMoodChart();
}

// Update recent mood list
function updateMoodList() {
  const moodList = document.getElementById('moodList');
  const moodHistory = JSON.parse(localStorage.getItem('moodHistory') || '[]');
  
  if (moodHistory.length === 0) {
    moodList.innerHTML = '<li>No mood entries yet</li>';
    return;
  }

  // Show last 5 entries
  const recentMoods = moodHistory.slice(-5).reverse();
  moodList.innerHTML = recentMoods.map(entry => 
    `<li><strong>${entry.mood}</strong> - ${entry.timestamp} (Weather: ${entry.weather})</li>`
  ).join('');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  updateMoodList();
  updateMoodChart();
});
