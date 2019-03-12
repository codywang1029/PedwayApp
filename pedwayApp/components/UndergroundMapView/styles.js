import {StyleSheet} from "react-native";

export default StyleSheet.create({
  focusButton: {
    zIndex: 0,
    position: 'absolute',
    top: 180,
    right: 20,
  },
  mainMap: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
},});
