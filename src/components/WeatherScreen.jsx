import React, {useEffect, useState} from 'react';
import {Text, View, Alert, Pressable, ImageBackground} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import fetchLocation from '../utils/fetchLocation';
import openAppSettings from '../utils/openSettings';
import styles from '../utils/style';
import dayjs from 'dayjs';

const WeatherScreen = () => {
  const [location, setLocation] = useState(null);
  const [date, setDate] = useState('');

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
    const currentDate = dayjs().format('MMM DD');
    setDate(currentDate);
    fetchData();
  }, []);

  return (
    <View className="h-full w-full px-8 gap-8">
      {/* Top Bar */}
      <View className="flex-row justify-between pb-2">
        <View className="flex-row items-center gap-3">
          <Ionicons name="location-outline" style={[styles.text]} />
          <Text style={[styles.text]}>Delhi</Text>
        </View>
        <View className="flex-row items-center gap-6">
          <Pressable>
            <Ionicons name="search-outline" style={[styles.text]} />
          </Pressable>
          <Pressable>
            <FontAwesome6 name="location-crosshairs" style={[styles.text]} />
          </Pressable>
        </View>
      </View>

      {/* Section 2 */}
      <View style={{ height: '33%', width: '100%', borderRadius: 10, overflow: 'hidden', }}>
    <ImageBackground
      source={require('../assets/img1.jpg')}
      style={{
        flex: 1,
        borderRadius: 10,
        overflow: 'hidden',
        justifyContent: 'space-between',
      }}
      imageStyle={{ borderRadius: 10 }}
      blurRadius={10}
    >
      <View style={{ paddingHorizontal: 16 }}>
        <Text style={[styles.text]}>Today, 09 May</Text>
        <Text style={[styles.text, { fontSize: 23 }]}>Clear and Sunny</Text>
      </View>

      <View>
        <Text style={[styles.text]}>Lower View</Text>
      </View>
    </ImageBackground>
  </View>


    </View>
  );
};

export default WeatherScreen;
