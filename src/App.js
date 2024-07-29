import { useState } from 'react';
import './App.css';
import { FaSearch } from 'react-icons/fa';

function App() {
  const [city, setCity] = useState('Tunisia');
  const [date, setDate] = useState('');
  const [error, setError] = useState(null);
  const [weather, setWeather] = useState(null);
  const [bgClass, setBgClass] = useState('day');

  const apiKey = '77f6c10df70e853b2b36991fe3e197fe';
  
  const fetchWeather = async () => {
    if (!city) return;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('City not found');
      const data = await response.json();
      
      // Get time zone offset in hours
      const timezoneOffset = data.timezone / 3600; // convert from seconds to hours

      // Get current local time and adjust for the timezone offset
      const localTime = new Date().getTime() / 1000 + timezoneOffset * 3600;
      
      // Convert sunrise and sunset times from UTC
      const sunrise = data.sys.sunrise + timezoneOffset * 3600;
      const sunset = data.sys.sunset + timezoneOffset * 3600;

      console.log(`Local time: ${new Date(localTime * 1000).toLocaleString()}`);
      console.log(`Sunrise: ${new Date(sunrise * 1000).toLocaleString()}`);
      console.log(`Sunset: ${new Date(sunset * 1000).toLocaleString()}`);
      
      setWeather(data);
      setDate(new Date(data.dt * 1000).toLocaleDateString());

      // Update background based on time of day
      if (localTime > sunrise && localTime < sunset) {
        setBgClass('day'); // Daytime background
      } else {
        setBgClass('night'); // Nighttime background
      }

      setError(null);
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setBgClass('day'); // Default to day if there’s an error
    }
  };

  return (
    <div className={`App ${bgClass}`}>
      <p id='name'>WEATHER APP</p>
      <div className='app-input'>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder='Enter your city'
        />
        <button onClick={fetchWeather}><FaSearch /></button>
      </div>
      <div className='app-output'>
        {error && <p>{error}</p>}
        {weather && (
          <div className='general-detail'>
            <h4>{weather.name}</h4>
            <p>{date}</p>
          </div>
        )}
        {weather && (
          <div className='weather-detail'>
            <h10>{weather.main.temp}°C</h10>
            <p>{weather.weather[0].description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
