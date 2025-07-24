import { DateTime } from "luxon";

const API_KEY = '74348a43a0f5916770db27b3be0bf3ce';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/';

const getWeatherData = (infoType, searchParams) => {
    const url = new URL(BASE_URL + infoType);
    url.search = new URLSearchParams({ ...searchParams, appid: API_KEY }).toString();

    return fetch(url)
        .then((res) => {
            if (!res.ok) {
                throw new Error(`Error: ${res.status} ${res.statusText}`);
            }
            return res.json();
        });
};

const iconUrlFromCode = (icon) => `https://openweathermap.org/img/wn/${icon}@2x.png`;

const formatToLocalTime = (
    secs,
    offset,
    format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a"
) => DateTime.fromSeconds(secs, { zone: 'utc' }).plus({ seconds: offset }).toFormat(format);

const formatCurrent = (data) => {
    const {
        coord: { lat, lon },
        main: { temp, feels_like, temp_min, temp_max, humidity },
        name,
        dt,
        sys: { country, sunrise, sunset },
        weather,
        wind: { speed },
        timezone,
    } = data;

    const { main: details, icon } = weather[0];
    const formattedLocalTime = formatToLocalTime(dt, timezone);

    return {
        lat,
        lon,
        temp,
        feels_like,
        temp_min,
        temp_max,
        humidity,
        name,
        country,
        sunrise: formatToLocalTime(sunrise, timezone, 'hh:mm a'),
        sunset: formatToLocalTime(sunset, timezone, 'hh:mm a'),
        details,
        icon: iconUrlFromCode(icon),
        formattedLocalTime,
        dt,
        timezone,
        lat,
        lon,
        speed
    };
};

const formatForecast = (secs, offset, data) => {
    //hourly

    const hourly = data.filter((f) => f.dt > secs).slice(0, 5).map((f) => ({
        temp: f.main.temp,
        title: formatToLocalTime(f.dt, offset, "hh:mm a"),
        icon: iconUrlFromCode(f.weather[0].icon),
        date: f.dt_txt,
    }));


    //daily

    const daily = data.filter((f) => f.dt_txt.slice(-8) === '00:00:00').map((f) => ({
        temp: f.main.temp,
        title: formatToLocalTime(f.dt, offset, "ccc"),
        icon: iconUrlFromCode(f.weather[0].icon),
        date: f.dt_txt,
    }))

    return {hourly, daily};
}

const getFormattedWeatherData = async (searchParams) => {
    const formattedCurrentWeather = await getWeatherData('weather', searchParams).then(formatCurrent);

    const {dt, lat, lon, timezone} = formattedCurrentWeather;

    const formattedForecast = await getWeatherData('forecast', {lat, lon, units: searchParams.units}).then((d) => formatForecast(dt, timezone, d.list))

    return { ...formattedCurrentWeather, ...formattedForecast };
};

export default getFormattedWeatherData;
