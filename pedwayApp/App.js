/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * reference: https://stackoverflow.com/questions/51607886/react-native-json-fetch-from-url
 * https://github.com/react-native-community/react-native-side-menu
 * https://stackoverflow.com/questions/30448547/how-to-model-a-button-with-icons-in-react-native
 * https://github.com/oblador/react-native-vector-icons
 * https://github.com/react-native-community/react-native-maps/blob/master/docs/installation.md
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Button} from 'react-native';
import {Platform, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import APIManager from './APIManager';
import MapView from "react-native-maps";
import SideMenu from 'react-native-side-menu';


type Props = {};
export default class App extends Component<Props> {

  constructor() {
    console.log("INIT Pedway App");
    super();
    this.state = {
      mainStatusText: 'Requesting from backend...',
      entrance1StatusText: '',
      macysStatusText: '',
      sideMenuIsOpen: false,
      sideMenuDisableGesture: true,

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
      <SideMenu
        menu={<SideMenu navigator={navigator}/>}
        disableGestures={this.state.sideMenuDisableGesture}
        isOpen={this.state.sideMenuIsOpen}
        onChange={(openStatus) => {
          this.state.sideMenuIsOpen = openStatus;
          this.setState({sideMenuDisableGesture: !openStatus});
        }}
      >
        <View style={{flex: 1}}>
          <MapView
            region={{
              latitude: 40.113918,
              longitude: -88.224916,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
            style={styles.mainMap}>

          </MapView>
          <TouchableOpacity
            style={styles.hamburgerButton}
            onPress={() => {
              console.log("Menu Button Clicked!");
              this.setState({
                sideMenuIsOpen: !this.state.sideMenuIsOpen,
              });
            }}>
            <Icon
              name="bars"
              size={35}
              color="#555"
            />
          </TouchableOpacity>
        </View>
      </SideMenu>
    );
  }
}

const styles = StyleSheet.create({
  hamburgerButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  mainMap: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  }
});

