import React, {useEffect, useState} from 'react';
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

const WeatherScreen = () => {
  const [location, setLocation] = useState(null);
  const [date, setDate] = useState('');
  const [searchModal, setSearchModal] = useState(false);

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
    <ScrollView className="h-full w-full px-8">
      {/* Top Bar */}
      <View className="flex-row justify-between pb-2 mt-5">
        <View className="flex-row items-center gap-3">
          <Ionicons name="location-outline" style={[styles.text]} />
          <Text style={[styles.text]}>Delhi</Text>
        </View>
        <View className="flex-row items-center gap-6">
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
              <FontAwesome6 name="wind" style={styles.text} /> 18C
            </Text>
          </View>

          <View style={[styles.S3]} className="w-[47%] p-5">
            <Text className="text-white">Humidity</Text>
            <Text style={styles.text}>
              <Entypo name="water" style={styles.text} /> 18C
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
              style={[styles.S3, {width: '100%', height: '90%' ,padding:8}]}
              onStartShouldSetResponder={() => true}
            >
              <View style={{backgroundColor:"black",borderRadius:20}}>
<TextInput placeholder='place' style={ {
    height: 40,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor:'rgba(255, 255, 255, 0.3)',
    borderRadius:20,
    padding: 10,

  }}/>
              </View>
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
