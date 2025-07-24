import React, { useEffect, useState } from 'react';
import TopButtons from './components/TopButtons';
import Inputs from './components/Inputs';
import TimeAndLocation from './components/TimeAndLocation';
import TempAndDetail from './components/TempAndDetail';
import Forecast from './components/Forecast';
import getFormattedWeatherData from './services/WeatherService';
import { ToastContainer, toast } from 'react-toastify';
import AppTheme from './layout/AppTheme';

const App = () => {
  const [query, setQuery] = useState(() => {
    const savedQuery = localStorage.getItem('query');
    return savedQuery ? JSON.parse(savedQuery) : { q: 'gjilan' };
  });

  const [units, setUnits] = useState(() => {
    return localStorage.getItem('units') || 'metric';
  });

  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('query', JSON.stringify(query));
  }, [query]);

  useEffect(() => {
    localStorage.setItem('units', units);
  }, [units]);

  useEffect(() => {
    const getWeather = async () => {
      const message = query.q ? query.q : 'current location';
      toast.info(`Fetching weather for ${message}...`);
      setLoading(true);

      try {
        const data = await getFormattedWeatherData({ ...query, units });
        toast.success(`Fetched weather for ${data.name}, ${data.country}!`);
        setWeather(data);
        console.log(data);
      } catch (err) {
        console.error('Failed to fetch weather:', err);
        toast.error('City not found or API error. Please try again!');
      } finally {
        setLoading(false);
      }
    };

    getWeather();
  }, [query, units]);

  const formatBackground = () => {
    if (!weather) return 'from-cyan-500 to-blue-700 dark:from-cyan-900 dark:to-blue-900';
    const threshold = units === 'metric' ? 20 : 60;
    if (weather.temp <= threshold) return 'from-cyan-500 to-blue-700 dark:from-cyan-900 dark:to-blue-900';
    return 'from-yellow-600 to-orange-800 dark:from-yellow-900 dark:to-orange-900';
  };

  return (
    <div
      className={`mx-auto max-w-screen-lg my-1 py-3 px-4 sm:px-8 md:px-16 lg:px-32 bg-gradient-to-br ${formatBackground()} shadow-xl shadow-stone-400 dark:shadow-stone-700`}
    >

      {/* ------ dark mode ------ */}
      <AppTheme />

      <TopButtons setQuery={setQuery} />
      <Inputs setQuery={setQuery} setUnits={setUnits} />

      {loading && (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
        </div>
      )}

      {weather && (
        <>
          <TimeAndLocation weather={weather} />
          <TempAndDetail weather={weather} units={units} />
          <Forecast title="3-hour forecast" data={weather.hourly} />
          <Forecast title="daily forecast" data={weather.daily} />
        </>
      )}

      <ToastContainer autoClose={2500} hideProgressBar={true} theme="colored" />
    </div>
  );
};

export default App;
