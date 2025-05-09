import Geolocation from 'react-native-geolocation-service';
import requestLocationPermission from './requestLocationPermission';

async function fetchLocation() {
  const hasLocationAccess = await requestLocationPermission();
  if (!hasLocationAccess) {
    throw new Error('Location permission denied');
  }

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => resolve(position.coords),
      error => reject(error),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });
}

export default fetchLocation;
