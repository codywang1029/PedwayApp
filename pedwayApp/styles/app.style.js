import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  searchBox: {
    position: 'absolute',
    top: 25,
    left: 80,
    height: 50,
    width: 300,
    backgroundColor: '#FFFFFF',
    color: '#CCCCCC',
    textAlignVertical: 'center',
    paddingLeft: 5,
    marginLeft: 20,
    borderRadius: 10,
  },

  mainMap: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
});
