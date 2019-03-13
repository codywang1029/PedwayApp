import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  backgroundView: {
    position: 'relative',
    flex: 1,
    backgroundColor: 'white',
    // borderTopRightRadius: 10,
    // borderTopLeftRadius: 10,
    height: 150,
    zIndex: 100000,
  },
  entranceLabel: {
    position: 'absolute',
    top: 20,
    left: 30,
    fontSize: 30,
    color: '#222',
  },
  routeButtonContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  routeBackgroundContainer: {
    top: 20,
    marginRight: 40,
  },
  routeButton: {
    fontSize: 40,
  },
  statusLabelContainer: {
    position: 'absolute',
    borderRadius: 5,
    top: 65,
    left: 30,
  },
  statusLabelGreen: {
    backgroundColor: '#59b60f',
  },
  statusLabelRed: {
    backgroundColor: '#f44242',
  },
  statusLabelGrey: {
    backgroundColor: '#888',
  },
  statusLabelText: {
    fontSize: 17,
    padding: 4,
    color: '#fff',
  },
  coordinateText: {
    position: 'absolute',
    color: '#999',
    fontSize: 13,
    top: 70,
    left: 100,
  },
});
