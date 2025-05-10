export const getWeatherStatus = (temp, rain, clouds) => {
  const tempStatus =
    temp <= 15 ? 'Cold' :
    temp <= 25 ? 'Warm' :
    temp <= 32 ? 'Hot' : 'Very hot';

  const condition =
    rain > 0.2 ? 'rainy' :
    clouds > 60 ? 'cloudy' : 'clear';

  return `${tempStatus} and ${condition}`;
};

export const getFeelsLikeText = (feelsLike) => {
  if (feelsLike <= 15) return 'Quite cool today due to the humidity.';
  if (feelsLike <= 25) return 'Comfortably warm with a slight humidity effect.';
  if (feelsLike <= 32) return 'Hot and humid right now.';
  return 'Hot, humidity is making it feel worse.';
};

export const getWeatherImage = (temp, rain, clouds) => {
  if (rain > 0.2) return WEATHER_IMAGES.RAINY;
  if (clouds > 60) return WEATHER_IMAGES.CLOUDY;
  if (temp <= 15) return WEATHER_IMAGES.COLD;
  if (temp >= 30) return WEATHER_IMAGES.HOT;
  return WEATHER_IMAGES.CLEAR;
};

export const getWeatherIcon = (temp, rain, clouds) => {
  const isNight = isNightTime();

  // Rain conditions
  if (rain > 0.2) {
    return {
      name: isNight ? 'cloud-moon-rain' : 'cloud-sun-rain',
      library: 'FontAwesome6' // FA6 has better rain icons
    };
  }

  // Cloud conditions
  if (clouds > 60) {
    return {
      name: isNight ? 'cloud-moon' : 'cloud-sun',
      library: 'FontAwesome5' // FA5 has smoother cloud icons
    };
  }

  // Temperature based
  if (temp <= 15) {
    return {
      name: 'snowflake',
      library: 'FontAwesome5' // FA5 snowflake is more detailed
    };
  }

  // Clear conditions
  return {
    name: isNight ? 'moon' : 'sun',
    library: 'FontAwesome6' // FA6 has better sun/moon icons
  };
};

export const isNightTime = () => {
  const hour = new Date().getHours();
  return hour >= 18 || hour < 6;
};
