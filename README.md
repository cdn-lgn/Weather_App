# Weather App

A beautiful and modern weather application built with React Native that provides real-time weather information with a sleek user interface.

## Features

- Real-time weather data
- Location-based weather updates
- Search functionality for any location
- 24-hour temperature forecast
- 7-day weather forecast
- Weather conditions visualization
- Detailed weather metrics (Temperature, Humidity, Wind, etc.)

## Screenshots

<!-- Add these screenshots to /home/kali/Desktop/WeatherApp/screenshots/ directory -->

<div style="display: flex; gap: 10px;">
    <img src="src/assets/sample1.jpg" width="200" alt="Home Screen"/>
    <img src="src/assets/sample2.jpg" width="200" alt="Search Screen"/>
</div>

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/WeatherApp.git
```

2. Install dependencies
```bash
cd WeatherApp
npm install
```

3. Run the app
```bash
# For Android
npm run android

# For iOS
cd ios && pod install && cd ..
npm run ios
```

## API Integration

This app uses two main APIs:
- OpenStreetMap API for location search
- Open-Meteo API for weather data

## Tech Stack

- React Native
- NativeWind (TailwindCSS)
- Victory Native (Charts)
- React Native Vector Icons
- Axios for API calls
- dayjs for date handling

## Assets
The app uses two background images for day and night modes:
- `src/assets/sample1.jpg` - Day background
- `src/assets/sample2.jpg` - Night background

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Weather data provided by Open-Meteo
- Location data provided by OpenStreetMap
- Icons from React Native Vector Icons
