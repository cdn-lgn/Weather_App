import React, {useEffect, useState} from 'react';
import {Text, View, Alert, Button} from 'react-native';
import fetchLocation from '../utils/fetchLocation';
import openAppSettings from '../utils/openSettings';

const WeatherScreen = () => {
  const [location, setLocation] = useState(null);

  const fetchData = async () => {
    try {
      const coords = await fetchLocation();
      setLocation(coords);
    } catch (error) {
      Alert.alert(
        'Permission Required',
        'Location access is required. Please enable it in settings.',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Open Settings', onPress: openAppSettings},
        ],
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View >
      <Text className="text-3xl text-cyan-600">Hello there</Text>

      {location ? (
        <Text className="text-lg text-gray-700 text-center">
          {`Latitude: ${location.latitude}\nLongitude: ${location.longitude}`}
        </Text>
      ) : (
        <Text className="text-gray-500">Fetching location...</Text>
      )}
      <Button title="Refresh Location" onPress={fetchData} />
    </View>
  );
};

export default WeatherScreen;
