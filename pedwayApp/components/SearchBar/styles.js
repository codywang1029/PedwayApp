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
  floating: {
    shadowOffset: {width: 30, height: 30},
    shadowColor: 'rgba(0, 0, 0, 0.6)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 15,
    alignItems: 'center',
    textAlignVertical: 'center',
    opacity: 0.95,
  },
});
