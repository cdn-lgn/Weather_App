export const WEATHER_API = {
  DAILY: (lat, lon) =>
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,windspeed_10m,cloudcover,precipitation&forecast_days=1&timezone=auto`,
  WEEKLY: (lat, lon) =>
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min&forecast_days=7&timezone=auto`,
};

export const LOCATION_API = {
  SEARCH: query => `https://nominatim.openstreetmap.org/search?q=${query}&format=json`,
  REVERSE: (lat, lon) => `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
};

export const WEATHER_IMAGES = {
  DAY: require('../assets/day.jpg'),
  NIGHT: require('../assets/night.jpg'),
};
