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
import { Button } from 'react-native';
import {Platform, StyleSheet, Text, View} from 'react-native';
import APIManager from './APIManager';
import MapView from "react-native-maps";

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

// reference: https://github.com/react-native-community/react-native-maps/blob/master/docs/installation.md
// Dummy test for the map view
export default () => (
    <View style={{flex : 1}}>
      <MapView
          region={{
              latitude: 40.113918,
              longitude:  -88.224916,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
          }}
          style={{ ...StyleSheet.absoluteFillObject}}
      />

      <Button
          title="Enter Underground"
          color="#4c525b"
          onPress={()=>{}}
      />

    </View>

);

