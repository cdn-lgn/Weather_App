import {StatusBar, View} from 'react-native';
import './global.css';
import WeatherScreen from './src/components/WeatherScreen';

const App = () => {
  return (
    <View className="flex-1 bg-black">
      <StatusBar backgroundColor={"black"}/>
      <WeatherScreen />
    </View>
  );
};
export default App;
