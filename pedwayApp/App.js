/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * reference: https://stackoverflow.com/questions/51607886/react-native-json-fetch-from-url
 * https://github.com/react-native-community/react-native-side-menu
 * https://stackoverflow.com/questions/30448547/how-to-model-a-button-with-icons-in-react-native
 * https://github.com/oblador/react-native-vector-icons
 * https://github.com/react-native-community/react-native-maps/blob/master/docs/installation.md
 * https://www.igismap.com/switching-between-google-maps-and-openstreetmap-in-react-native/
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
import MapView, {MAP_TYPES, PROVIDER_DEFAULT, UrlTile} from "react-native-maps";
import SideMenu from 'react-native-side-menu';
import {createAppContainer, createStackNavigator} from 'react-navigation';
import Realm from 'realm';


class HomeScreen extends React.Component {
  constructor() {
    console.log("INIT Pedway App");
    super();
    this.state = {
      mainStatusText: 'Requesting from backend...',
      entrance1StatusText: '',
      macysStatusText: '',
      sideMenuIsOpen: false,
      sideMenuDisableGesture: true,
      apiServerURL: 'http://a.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png',
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
            mapType={MAP_TYPES.NONE}
            style={styles.mainMap}
            provider={null}
            region={{
              latitude: 40.113918,
              longitude: -88.224916,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}>
            <UrlTile urlTemplate={this.state.apiServerURL}/>
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
          <TouchableOpacity
            style={styles.undergroundButton}
            onPress={() => {
              this.props.navigation.dispatch(StackActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({routeName: 'Underground'})
                ],
              }))
            }}>
            <View style={{flexGrow: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Icon
                name="level-down"
                size={40}
                color="#555"
              />
            </View>
          </TouchableOpacity>
        </View>
      </SideMenu>
    );
  }
}

class UndergroundScreen extends React.Component {
  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Underground Screen</Text>
      </View>
    );
  }
}


const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen,
  },
  Underground: {
    screen: UndergroundScreen,
  },
}, {
  initialRouteName: 'Home',
});


const styles = StyleSheet.create({
  hamburgerButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  undergroundButton: {
    zIndex: 1,
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 60,
    shadowOffset: {width: 30, height: 30,},
    shadowColor: 'rgba(0, 0, 0, 0.6)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 15,
    alignItems: 'center',
    textAlignVertical: 'center',
  },
  mainMap: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  }
});

export default createAppContainer(AppNavigator);