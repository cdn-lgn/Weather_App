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
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {LineChart} from "react-native-gifted-charts"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import fetchLocation from '../utils/fetchLocation';
import openAppSettings from '../utils/openSettings';
import styles from '../utils/style';
import dayjs from 'dayjs';
import {BlurView} from '@react-native-community/blur';
import axios from 'axios';
import {WEATHER_API, LOCATION_API, WEATHER_IMAGES} from '../utils/constants';
import {getWeatherStatus, getFeelsLikeText, getWeatherImage, isNightTime, getWeatherIcon} from '../utils/weatherUtils';

const getThermometerIcon = (temp) => {
  if (temp <= 15) return "thermometer-empty";
  if (temp <= 23) return "thermometer-quarter";
  if (temp <= 27) return "thermometer-half";
  if (temp <= 32) return "thermometer-three-quarters";
  return "thermometer-full";
};

const WeatherScreen = () => {
  const [location, setLocation] = useState(null);
  const [todayReport, setTodayReport] = useState({});
  const [upcommingDaysReport, setUpcommingDaysReport] = useState({});
  const [graphData, setGraphData] = useState([]); // Initialize as empty array instead of object

  const [searchLocations, setSearchLocations] = useState([]);
  const [searchModal, setSearchModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const intervalRef = useRef(null);

  const getCurrentHourIndex = () => {
    const now = new Date();
    return now.getHours();
  };

  const fetchData = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const searchHandle = text => {
    if (intervalRef.current) clearTimeout(intervalRef.current);
    if (!text) return setSearchLocations([]);
    setIsSearching(true);

    intervalRef.current = setTimeout(async () => {
      try {
        const {data} = await axios.get(LOCATION_API.SEARCH(text));
        const results = data.map(place => ({
          name: place.name || place.display_name,
          display_name: place.display_name,
          lat: place.lat,
          lon: place.lon,
        }));
        setSearchLocations(results);
      } catch (error) {
        console.error('Error:', error);
        setSearchLocations([]);
      } finally {
        setIsSearching(false);
      }
    }, 1000);
  };

  const placeClickHandler = async place => {
    await fetchWeatherData(place.lat, place.lon);
    setSearchModal(false);
    setLocation(place);
  };

  const fetchWeatherData = async (lat, lon) => {
    try {
      const hour = getCurrentHourIndex();
      const [dailyResponse, sevenDayResponse] = await Promise.all([
        axios.get(WEATHER_API.DAILY(lat, lon)),
        axios.get(WEATHER_API.WEEKLY(lat, lon)),
      ]);

      const {hourly, hourly_units: units} = dailyResponse.data;
      const {daily} = sevenDayResponse.data;

      // Make sure we're setting an array of data points
      const graphData = Array.from({length: 24}, (_, index) => ({
        value: Math.round(hourly.temperature_2m[index]),
        label: `${index}h`,
        dataPointText: `${Math.round(hourly.temperature_2m[index])}°`
      }));

      setGraphData(graphData);

      setTodayReport({
        hourly: {
          time: hourly.time,
          temp: hourly.temperature_2m,
        },
        feelsLike: hourly.apparent_temperature[hour],
        humidity: hourly.relative_humidity_2m[hour],
        wind: hourly.windspeed_10m[hour],
        rain: hourly.precipitation,
        clouds: hourly.cloudcover,
        units,
      });

      setUpcommingDaysReport({
        date: daily.time,
        max: daily.temperature_2m_max.map(Math.round),
        min: daily.temperature_2m_min.map(Math.round),
      });
    } catch (error) {
      console.log('Weather data fetch error:', error);
      Alert.alert('Error', 'Unable to fetch weather data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScrollView className="h-full w-full px-4">
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
          source={isNightTime() ? WEATHER_IMAGES.NIGHT : WEATHER_IMAGES.DAY}
          style={{
            height: '100%',
            width: '100%',
          }}
          blurRadius={10}>
          <View style={styles.darkOverlay}>
            <View className="flex-row justify-between items-start">
              <View>
                <Text style={[styles.text]}>Today, {dayjs().format('MMM DD')}</Text>
                <Text style={[styles.text, {fontSize: 23}]}>
                  {todayReport?.hourly && getWeatherStatus(
                    todayReport.hourly.temp[getCurrentHourIndex()],
                    todayReport.rain[getCurrentHourIndex()],
                    todayReport.clouds[getCurrentHourIndex()],
                  )}
                </Text>
              </View>

              {todayReport?.hourly && (
                <View style={styles.weatherIconButton}>
                  {(() => {
                    const icon = getWeatherIcon(
                      todayReport.hourly.temp[getCurrentHourIndex()],
                      todayReport.rain[getCurrentHourIndex()],
                      todayReport.clouds[getCurrentHourIndex()]
                    );
                    const IconComponent = icon.library === 'FontAwesome5' ? FontAwesome5 : FontAwesome6;
                    return (
                      <IconComponent
                        name={icon.name}
                        style={[styles.text, {fontSize: 30}]}
                      />
                    );
                  })()}
                </View>
              )}
            </View>

            <View className="flex items-end justify-between flex-row">
              <Text style={[styles.text, {fontSize: 45}]}>
                {todayReport.hourly &&
                  `${Math.round(todayReport.hourly.temp[getCurrentHourIndex()])}${
                    todayReport.units.temperature_2m
                  }`}
              </Text>
              <Text style={[styles.text, {paddingBottom: 5}]}>
                {upcommingDaysReport?.date &&
                  `${upcommingDaysReport.max[0]}/${upcommingDaysReport.min[0]}${todayReport.units.temperature_2m}`}
              </Text>
              <TouchableOpacity
                onPress={() => fetchWeatherData(location.lat, location.lon)}
                style={[styles.circleButton, {transform: [{scaleX: -1}]}]}
                activeOpacity={0.7}>
                <MaterialCommunityIcons
                  name="refresh"
                  style={[styles.text, {fontSize: 23}]}
                />
              </TouchableOpacity>
            </View>
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
              <FontAwesome
                name={todayReport.feelsLike ? getThermometerIcon(todayReport.feelsLike) : "thermometer-empty"}
                style={styles.text}
              />{' '}
              {todayReport.hourly &&
                Math.round(todayReport.feelsLike) +
                  '  ' +
                  todayReport.units.apparent_temperature}
            </Text>
          </View>

          <Text className="text-white w-1/2">
            {getFeelsLikeText(todayReport.feelsLike)}
          </Text>
        </View>

        {/* Two Column Cards */}
        <View className="flex-row justify-between w-full">
          <View style={[styles.S3]} className="w-[47%] p-5">
            <Text className="text-white">Wind</Text>
            <Text style={styles.text}>
              <FontAwesome6 name="wind" style={styles.text} />{' '}
              {todayReport.wind &&
                todayReport.wind + ' ' + todayReport.units.windspeed_10m}
            </Text>
          </View>

          <View style={[styles.S3]} className="w-[47%] p-5">
            <Text className="text-white">Humidity</Text>
            <Text style={styles.text}>
              <Entypo name="water" style={styles.text} />{' '}
              {todayReport.humidity &&
                todayReport.humidity +
                  ' ' +
                  todayReport.units.relative_humidity_2m}
            </Text>
          </View>
        </View>
      </View>

      {/* Section 4 - Hourly Forecast */}
      <View style={[styles.S3]} className="w-full mb-5 p-5 rounded-3xl">
        <View className="flex-row justify-between items-center mb-4">
          <Text style={[styles.text]} className="text-lg">Today</Text>
        </View>
        <View style={{width: '100%'}} className="justify-center">
          <LineChart
            data={graphData}
            initialSpacing={5}
            spacing={35}
            maxValue={60}
            dataPointsRadius={0}
            minValue={-20}
            color="rgba(255, 255, 255, 0.8)"
            areaChart
            isAnimated
            animationDuration={1500}
            startFillColor="#56acce"
            startOpacity={0.8}
            endOpacity={0.3}
            hideAxesAndRules
            hideYAxisText
            textColor="white"
            textFontSize={14}
            xAxisLabelTextStyle={{color: 'white', fontSize: 12}}
          />
        </View>
      </View>

      {/* Section 5 - Weekly Forecast */}
      <View style={[styles.S3]} className="w-full mb-5 p-5 rounded-3xl">
        <View className="flex-row justify-between items-center mb-4">
          <Text style={[styles.text]} className="text-lg">
            Next Forecast
          </Text>
          <Text style={[styles.text]} className="text-sm opacity-80">
            7 days
          </Text>
        </View>
        <ScrollView style={{height: 250}} showsVerticalScrollIndicator={false}>
          <View className="gap-4">
            {upcommingDaysReport?.date?.map((date, index) => (
              <View
                key={index}
                className="flex-row items-center justify-between">
                <Text style={styles.text} className="w-24">
                  {index === 0
                    ? 'Today'
                    : index === 1
                    ? 'Tomorrow'
                    : `${dayjs(date).format('ddd')}, ${dayjs(date).format('DD')}`}
                </Text>
                <View className="flex-row items-center gap-2">
                  <Text style={styles.text}>
                    {upcommingDaysReport.max[index]}°
                  </Text>
                  <Text style={[styles.text, {opacity: 0.5}]}>
                    {upcommingDaysReport.min[index]}°
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {isLoading && (
        <View className="absolute inset-0 flex items-center justify-center bg-black/50">
          <ActivityIndicator size="large" color="white" />
        </View>
      )}

      {/* =========Modal View Here ========== */}
      {/* =========Modal View Here ========== */}
      {/* =========Modal View Here ========== */}
      <Modal visible={searchModal} transparent={true} animationType="slide">
        <BlurView
          style={{flex: 1}}
          blurType="dark"
          blurAmount={1}
          reducedTransparencyFallbackColor="black">
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}>
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
                    placeholder="Place"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    style={{
                      height: 40,
                      borderWidth: 2,
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      borderRadius: 20,
                      padding: 10,
                      color: 'white',
                    }}
                    onChangeText={searchHandle}
                  />
                </View>
                <ScrollView
                  keyboardShouldPersistTaps="always"
                  style={{
                    backgroundColor: 'black',
                    borderRadius: 10,
                    padding: 12,
                  }}>
                  <View style={{gap: 4}}>
                    {isSearching ? (
                      <View className="py-4 items-center">
                        <ActivityIndicator color="white" />
                      </View>
                    ) : (
                      searchLocations.map((place, index) => (
                        <TouchableOpacity
                          key={index}
                          activeOpacity={0.7}
                          style={{
                            borderRadius: 10,
                            borderColor: '#212121',
                            borderBottomWidth: 1,
                            padding: 8,
                            minHeight: 40,
                          }}
                          onPress={() => placeClickHandler(place)}>
                          <Text
                            style={{color: 'white'}}
                            numberOfLines={2}
                            ellipsizeMode="tail">
                            {place.display_name}
                          </Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </View>
                </ScrollView>
              </View>
            </Pressable>
          </KeyboardAvoidingView>
        </BlurView>
      </Modal>
      {/* =========Modal View end Here ========== */}
      {/* =========Modal View end Here ========== */}
      {/* =========Modal View end Here ========== */}
    </ScrollView>
  );
};

export default WeatherScreen;
