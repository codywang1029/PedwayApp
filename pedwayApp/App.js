/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * reference: https://stackoverflow.com/questions/51607886/react-native-json-fetch-from-url
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import APIManager from './APIManager';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


type Props = {};
export default class App extends Component<Props> {

  constructor() {
    super();
    this.state = {
      mainStatusText: 'Requesting from backend...',
      entrance1StatusText: '',
      macysStatusText:''
    };
    console.log('Try Requesting API');
    APIManager.getInstance().getCurrentPedwayStatus().then(inputObj => {
      this.setState({mainStatusText: 'Current state of the pedway: ' + inputObj[0]['status']});
      this.setState({entrance1StatusText: 'Entrance 1: ' + inputObj[1]['status']});
      this.setState({macysStatusText: 'Macy\'s section: ' + inputObj[2]['status']});

    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Hello World!</Text>
        <Text style={styles.welcome}>{this.state.mainStatusText}</Text>
        <Text style={styles.welcome}>{this.state.entrance1StatusText}</Text>
        <Text style={styles.welcome}>{this.state.macysStatusText}</Text>


      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
