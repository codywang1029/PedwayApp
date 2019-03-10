/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * reference: https://stackoverflow.com/questions/51607886/react-native-json-fetch-from-url
 * https://github.com/react-native-community/react-native-side-menu
 * https://stackoverflow.com/questions/30448547/how-to-model-a-button-with-icons-in-react-native
 * https://github.com/oblador/react-native-vector-icons
 * https://github.com/react-native-community/react-native-maps/blob/master/docs/installation.md
 * https://www.igismap.com/switching-between-google-maps-and-openstreetmap-in-react-native/
 * https://stackoverflow.com/questions/39395404/react-native-import-the-whole-file-split-js-code-into-several-files
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Button} from 'react-native';
import {Platform, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import SideMenu from 'react-native-side-menu';
import styles from './styles/app.style';
import RoundButton from './components/RoundButton/RoundButton';
import GroundMapView from './components/GroundMapView/GroundMapView'
import SearchBar from './components/SearchBar/SearchBar';

/**
 * HomeScreen that gets rendered first when everything is loaded
 * Consists of a Sidemenu, a MainView, and a hamburger button that toggles
 * Sidemenu/MainView
 */
class HomeScreen extends React.Component {

  constructor() {
    console.log('INIT Pedway App');
    super();
    this.state = {
      mainStatusText: 'Requesting from backend...',
      entrance1StatusText: '',
      macysStatusText: '',
      sideMenuIsOpen: false,
      sideMenuDisableGesture: true,
      apiServerURL: 'http://a.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png',
    };
  }

  render() {

      const toggleSideBar = () => {this.setState({sideMenuIsOpen: !this.state.sideMenuIsOpen,});}

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
       <RoundButton style={[positions.hamburgerButton]} icon={"bars"} func={toggleSideBar}/>

        <MainView/>
      </SideMenu>
    );
  }
}

/**
 * MainViews that display groundMap and several Navigation buttons
 * The first button is to trigger the search field
 * The second button is the entry point for the underground map
 */
class MainView extends React.Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <GroundMapView />
        <SearchBar/>
        <RoundButton style={[positions.undergroundButton]} icon={"level-down"} func={() => {
          // this.props.navigation.dispatch(StackActions.reset({
          //   index: 0,
          //   actions: [
          //     NavigationActions.navigate({routeName: 'Underground'})
          //   ],
          // }))
        }}/>
      </View>
    );
  }
}


/**
 * WIP, should return a Component that only renders the pedway
 */
class UndergroundScreen extends React.Component {

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Underground Screen</Text>
        <RoundButton style={[positions.undergroundButton]} icon={"level-up"} func={() => {
          // this.props.navigation.dispatch(StackActions.reset({
          //   index: 0,
          //   actions: [
          //     NavigationActions.navigate({routeName: 'Home'})
          //   ],
          // }))
        }}/>
      </View>
    );
  }
}

const positions = StyleSheet.create({
  undergroundButton: {
    position: 'absolute',
      bottom: 30,
      right: 30,
  },
  hamburgerButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
});

export default class App extends React.Component {
  render() {
    return <HomeScreen/>;
  }
}
