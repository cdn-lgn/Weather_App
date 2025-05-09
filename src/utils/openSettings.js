import { Linking, Platform } from "react-native";

const openAppSettings = () => {
  if (Platform.OS === 'android') {
    Linking.openSettings();
  } else {
    Linking.openURL('app-settings:');
  }
};
export default openAppSettings
