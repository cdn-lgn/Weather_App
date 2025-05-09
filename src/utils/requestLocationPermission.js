import {PermissionsAndroid, Platform} from 'react-native';

const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    const hasFineLocationPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (!hasFineLocationPermission) {
      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return status === PermissionsAndroid.RESULTS.GRANTED;
    }

    return true;
  } else {
    return true;
  }
};

export default requestLocationPermission;
