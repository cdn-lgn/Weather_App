import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  text:{
    color:"white",
    fontSize:17
  },
  S3:{
    backgroundColor:"#212121",
    borderRadius:10,
  },
  circleButton: {
    padding: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center'
  },
  darkOverlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 10,
    display: 'flex',
    justifyContent: 'space-between',
  },
  weatherIconButton: {
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    width: 60,
  }
})

export default styles
