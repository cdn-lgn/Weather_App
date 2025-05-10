import React, {useEffect, useRef, useState} from 'react';
import {
  Text,
  View,
  Alert,
  Pressable,
  ImageBackground,
  ScrollView,
  Modal,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import fetchLocation from '../utils/fetchLocation';
import openAppSettings from '../utils/openSettings';
import styles from '../utils/style';
import dayjs from 'dayjs';
import {BlurView} from '@react-native-community/blur';
import axios from 'axios';

const WeatherScreen = () => {
  const [location, setLocation] = useState(null);
  const [todayReport, setTodayReport] = useState({});
  const [upcommingDaysReport, setUpcommingDaysReport] = useState({});
  const [searchLocations, setSearchLocations] = useState([]);
  const [searchModal, setSearchModal] = useState(false);
  const intervalRef = useRef(null);

  const fetchData = async () => {
    try {
      const coords = await fetchLocation();
      fetchWeatherData(coords.latitude, coords.longitude);
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`,
      );
      const data = response.data;
      const results = {
        name: data.name || data.display_name,
        display_name: data.display_name,
        lat: data.lat,
        lon: data.lon,
      };
      setLocation(results);
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

  const searchHandle = text => {
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
    }
    intervalRef.current = setTimeout(async () => {
      if (!text) {
        setSearchLocations([]);
        return;
      }
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?q=${text}&format=json`,
        );
        const data = response.data;
        const results = data.map(place => ({
          name: place.name || place.display_name,
          display_name: place.display_name,
          lat: place.lat,
          lon: place.lon,
        }));
        setSearchLocations(results);
      } catch (error) {
        console.error('Error fetching location:', error);
        setSearchLocations([]);
      }
    }, 1000);
  };

  const placeClickHandler = async place => {
    console.log(place);
    await fetchWeatherData(place.lat, place.lon);
    setLocation(place);
  };

  const fetchWeatherData = async (lat, lon) => {
    const dailyReport = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,windspeed_10m,cloudcover,precipitation&forecast_days=1&timezone=auto
`;
    const sevenDayReport = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min&forecast_days=7&timezone=auto`;
    console.log(dailyReport);
    try {
      const hour = new Date().getHours();
      const [dailyResponse, sevenDayResponse] = await Promise.all([
        axios.get(dailyReport),
        axios.get(sevenDayReport),
      ]);

      const result1 = dailyResponse.data;
      const result2 = sevenDayResponse.data;

      setTodayReport({
        hourly: {
          time: result1.hourly.time,
          temp: result1.hourly.temperature_2m,
        },
        feelsLike: result1.hourly.apparent_temperature[hour],
        humidity: result1.hourly.relative_humidity_2m[hour],
        wind: result1.hourly.windspeed_10m[hour],
        rain: result1.hourly.precipitation,
        clouds: result1.hourly.cloudcover,
        units: result1.hourly_units,
      });

      setUpcommingDaysReport({
        date: result2.daily.time,
        max: result2.daily.temperature_2m_max.map(temp => Math.round(temp)),
        min: result2.daily.temperature_2m_min.map(temp => Math.round(temp)),
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScrollView className="h-full w-full px-8">
      {/* Top Bar */}
      <View className="flex-row justify-between items-center pb-2 mt-5">
        <View className="flex-row items-center flex-1 mr-8">
          <Ionicons name="location-outline" style={[styles.text]} />
          <Text style={[styles.text]} ellipsizeMode="tail" numberOfLines={1}>
            {location?.name}
          </Text>
        </View>
        <View className="flex-row items-center gap-4">
          <TouchableOpacity
            onPress={() => setSearchModal(true)}
            style={styles.circleButton}>
            <Ionicons
              name="search-outline"
              style={[styles.text, {fontSize: 23}]}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={fetchData} style={styles.circleButton}>
            <FontAwesome6
              name="location-crosshairs"
              style={[styles.text, {fontSize: 23}]}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Section 2 */}
      <View
        style={{
          width: '100%',
          borderRadius: 10,
          overflow: 'hidden',
        }}
        className="my-5 h-[200px]">
        <ImageBackground
          source={require('../assets/img1.jpg')}
          style={{
            flex: 1,
            borderRadius: 10,
            overflow: 'hidden',
            justifyContent: 'space-between',
            padding: 10,
          }}
          imageStyle={{borderRadius: 10}}
          blurRadius={10}>
          <View>
            <Text style={[styles.text]}>Today, {dayjs().format('MMM DD')}</Text>
            {todayReport?.hourly  && (<Text style={[styles.text, { fontSize: 23 }]}>
  {`${
    todayReport.hourly.temp[dayjs().format('HH')] <= 15
      ? 'Cold'
      : todayReport.hourly.temp[dayjs().format('HH')] <= 25
      ? 'Warm'
      : todayReport.hourly.temp[dayjs().format('HH')] <= 32
      ? 'Hot'
      : 'Very hot'
  }${
    todayReport.rain[dayjs().format('HH')] > 0.2
      ? ' and rainy'
      : todayReport.clouds[dayjs().format('HH')] > 60
      ? ' and cloudy'
      : ' and clear'
  }`}
</Text>)}

          </View>

          <View className="flex items-end justify-between flex-row">
            <Text
              style={[
                styles.text,
                {fontSize: 45},
              ]}>
              {todayReport.hourly &&
               `${Math.round(todayReport.hourly.temp[dayjs().format('HH')])}${todayReport.units.temperature_2m}`}
            </Text>
            <Text style={[styles.text,{paddingBottom:5}]}>
              {upcommingDaysReport?.date &&
                `${upcommingDaysReport.max[0]}/${upcommingDaysReport.min[0]}${todayReport.units.temperature_2m}`}
            </Text>
            <TouchableOpacity
              onPress={() => fetchData()}
              style={[styles.circleButton, {transform: [{scaleX: -1}]}]}
              activeOpacity={0.7}>
              <MaterialCommunityIcons
                name="refresh"
                style={[styles.text, {fontSize: 23}]}
              />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>

      {/* Section 3 */}
      <View className="flex flex-col gap-5 mb-5">
        {/* Top Card */}
        <View
          style={styles.S3}
          className="flex-row items-center justify-between p-5">
          <View className="flex-col w-1/2">
            <Text className="text-white">Feel Like</Text>
            <Text style={styles.text}>
              <FontAwesome name="thermometer-empty" style={styles.text} /> {todayReport.hourly &&
               Math.round(todayReport.feelsLike)+" "+todayReport.units.apparent_temperature}
            </Text>
          </View>

          <Text className="text-white w-1/2">
            Humidity is making it feel cooler
          </Text>
        </View>

        {/* Two Column Cards */}
        <View className="flex-row justify-between w-full">
          <View style={[styles.S3]} className="w-[47%] p-5">
            <Text className="text-white">Feels Like</Text>
            <Text style={styles.text}>
              <FontAwesome6 name="wind" style={styles.text} /> {`${todayReport.wind+" "+todayReport.units.windspeed_10m}`}
            </Text>
          </View>

          <View style={[styles.S3]} className="w-[47%] p-5">
            <Text className="text-white">Humidity</Text>
            <Text style={styles.text}>
              <Entypo name="water" style={styles.text} /> {`${todayReport.humidity+" "+todayReport.units.relative_humidity_2m}`}
            </Text>
          </View>
        </View>
      </View>

      {/* Section 4 - Hourly Forecast */}
      <View style={[styles.S3]} className="w-full mb-5 p-5 rounded-3xl">
        <View className="flex-row justify-between items-center mb-4">
          <Text style={[styles.text]} className="text-lg">
            Today
          </Text>
          <Pressable>
            <Text style={[styles.text]} className="text-sm opacity-80">
              View full report
            </Text>
          </Pressable>
        </View>
        <View style={{height: 150}} className="justify-center">
          {/* Add your hourly forecast content here */}
        </View>
      </View>

      {/* Section 5 - Weekly Forecast */}
      <View style={[styles.S3]} className="w-full mb-5 p-5 rounded-3xl">
        <View className="flex-row justify-between items-center mb-4">
          <Text style={[styles.text]} className="text-lg">
            Next Forecast
          </Text>
          <Pressable>
            <Text style={[styles.text]} className="text-sm opacity-80">
              7 days
            </Text>
          </Pressable>
        </View>
        <View style={{height: 250}} className="justify-between">
          {/* Add your weekly forecast content here */}
        </View>
      </View>

      {/* =========Modal View Here ========== */}
      {/* =========Modal View Here ========== */}
      {/* =========Modal View Here ========== */}
      <Modal visible={searchModal} transparent={true} animationType="slide">
        <BlurView
          style={{flex: 1}}
          blurType="dark"
          blurAmount={1}
          reducedTransparencyFallbackColor="black">
          <Pressable
            style={{flex: 1}}
            onPress={() => setSearchModal(false)}
            className="flex items-end justify-end">
            <View
              style={[
                styles.S3,
                {
                  width: '100%',
                  height: '90%',
                  paddingVertical: 16,
                  paddingHorizontal: 8,
                  gap: 16,
                  justifyContent: 'flex-start',
                },
              ]}
              onStartShouldSetResponder={() => true}>
              <View style={{backgroundColor: 'black', borderRadius: 20}}>
                <TextInput
                  placeholder="place"
                  style={{
                    height: 40,
                    borderWidth: 2,
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: 20,
                    padding: 10,
                  }}
                  onChangeText={text => {
                    searchHandle(text);
                  }}
                />
              </View>
              <ScrollView
                style={{
                  backgroundColor: 'black',
                  borderRadius: 10,
                  padding: 12,
                }}>
                <View style={{gap: 4}}>
                  {searchLocations &&
                    searchLocations.map((place, index) => (
                      <TouchableOpacity
                        key={index}
                        style={{
                          borderRadius: 10,
                          borderColor: '#212121',
                          borderBottomWidth: 1,
                          height: 40,
                        }}
                        onPress={() => placeClickHandler(place)}>
                        <Text
                          style={{color: 'white'}}
                          numberOfLines={2}
                          ellipsizeMode="tail">
                          {place.display_name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                </View>
              </ScrollView>
            </View>
          </Pressable>
        </BlurView>
      </Modal>
      {/* =========Modal View end Here ========== */}
      {/* =========Modal View end Here ========== */}
      {/* =========Modal View end Here ========== */}
    </ScrollView>
  );
};

export default WeatherScreen;
