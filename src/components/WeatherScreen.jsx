import React, {useEffect, useState} from 'react';
import {Text, View, Alert, Pressable, ImageBackground, ScrollView} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
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
    <ScrollView
      className="h-full w-full px-8"
    >
      {/* Top Bar */}
      <View className="flex-row justify-between pb-2 mt-5">
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
      <View
        style={{
          // height: '25%',
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
            <Text style={[styles.text]}>Today, 09 May</Text>
            <Text style={[styles.text, {fontSize: 23}]}>Clear and Sunny</Text>
          </View>

          <View className="flex items-end justify-between flex-row">
            <Text
              style={[
                styles.text,
                {fontSize: 50, textAlignVertical: 'bottom'},
              ]}>
              23C
            </Text>
            <Text style={[styles.text, {fontSize: 23}]}>26/12</Text>
            <View
              style={{
                transform: [{scaleX: -1}],
                padding: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
              }}
              className="rounded-full">
              <MaterialCommunityIcons
                name="refresh"
                style={[styles.text, {fontSize: 23}]}
              />
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* Section 3 */}
      <View className="flex flex-col gap-5 mb-5">
        {/* Top Card */}
        <View
          style={styles.S3}
          className="flex-row items-center justify-between p-5"
        >
          <View className="flex-col w-1/2">
            <Text className="text-white">Feel Like</Text>
            <Text style={styles.text}>
              <FontAwesome name="thermometer-empty" style={styles.text} /> 18C
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
              <FontAwesome6 name="wind" style={styles.text}/> 18C
            </Text>
          </View>

          <View style={[styles.S3]} className="w-[47%] p-5">
            <Text className="text-white">Humidity</Text>
            <Text style={styles.text}>
              <Entypo name="water"style={styles.text}/> 18C
            </Text>
          </View>
        </View>
      </View>

      {/* Section 4 - Hourly Forecast */}
      <View style={[styles.S3]} className="w-full mb-5 p-5 rounded-3xl">
        <View className="flex-row justify-between items-center mb-4">
          <Text style={[styles.text]} className="text-lg">Today</Text>
          <Pressable>
            <Text style={[styles.text]} className="text-sm opacity-80">View full report</Text>
          </Pressable>
        </View>
        <View style={{height: 150}} className="justify-center">
          {/* Add your hourly forecast content here */}
        </View>
      </View>

      {/* Section 5 - Weekly Forecast */}
      <View style={[styles.S3]} className="w-full mb-5 p-5 rounded-3xl">
        <View className="flex-row justify-between items-center mb-4">
          <Text style={[styles.text]} className="text-lg">Next Forecast</Text>
          <Pressable>
            <Text style={[styles.text]} className="text-sm opacity-80">7 days</Text>
          </Pressable>
        </View>
        <View style={{height: 250}} className="justify-between">
          {/* Add your weekly forecast content here */}
        </View>
      </View>

    </ScrollView>
  );
};

export default WeatherScreen;
