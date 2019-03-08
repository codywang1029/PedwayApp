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
import MapView, {
  MAP_TYPES,
  UrlTile,
  Polyline,
  Polygon,
} from 'react-native-maps';
import {Button} from 'react-native';
import {Platform, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import SideMenu from 'react-native-side-menu';
import StyleJson from './mapStyleDark.json';
import PedwaySection from './modal/PedwaySection.js';
import PedwayCoordinate from './modal/PedwayCoordinate.js';

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
        <TouchableOpacity
          style={[styles.hamburgerButton, styles.floating, styles.roundButton]}
          onPress={() => {
            this.setState({
              sideMenuIsOpen: !this.state.sideMenuIsOpen,
            });
          }}>
          <View style={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Icon
              name="bars"
              size={35}
              color="#555"
            />
          </View>
        </TouchableOpacity>
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
        <GroundMapView/>
        <TouchableOpacity
          style={[styles.floating, styles.searchBox]}
        >
          <View style={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}>
            <Text style={{fontSize: 18}}>Enter your destination...</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.undergroundButton, styles.floating, styles.roundButton]}
          onPress={() => {
          }}>
          <View style={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Icon
              name="level-down"
              size={40}
              color="#555"
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}


/**
 * Renders a MapView that display the ground level map
 * we are setting provider to null and UrlTile to OpenStreetMap's API
 * to use OSM
 */
class GroundMapView extends React.Component {


  constructor() {
    super();

    this.state = {
      apiServerURL: 'http://a.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png',
    };
  }

  render() {
    return (
      <MapView
        style={styles.mainMap}
        customMapStyle={StyleJson}
        region={{
          latitude: 40.113918,
          longitude: -88.224916,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}>
        <MapView.Marker
          coordinate={{
            latitude: 40.114399,
            longitude: -88.223961,
          }}
          title={'title'}
          description={'description'}
        />
        <RenderPedway/>
      </MapView>
    );
  }
}

/**
 * The current pedway sections are hard coded place holders
 * In the future we are gonna to get those values from the API
 * */
class RenderPedway extends Component {

  constructor(props) {
    super(props);
    let section1 = new PedwaySection([new PedwayCoordinate(40.143, -88.231),
      new PedwayCoordinate(40.0953, -88.255462), new PedwayCoordinate(40.068305, -88.205)]);
    let section2 = new PedwaySection([new PedwayCoordinate(40.116300, -88.2737),
      new PedwayCoordinate(40.116329, -88.224462)]);
    this.state = {
      pedwaySections: [section1, section2],
    };
  }

  render() {
    return (
      this.state.pedwaySections.map((path, idx) => {
        return (
          <MapView.Polyline
            key={idx}
            coordinates={path.getJSONList()}
            strokeColor='#42b0f4'
            strokeWidth={3}
          />);
      })
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
        <TouchableOpacity
          style={[styles.undergroundButton, styles.floating, styles.roundButton]}
          onPress={() => {
          }}>
          <View style={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Icon
              name="level-up"
              size={40}
              color="#555"
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}


const styles = StyleSheet.create({
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
  roundButton: {
    zIndex: 1,
    width: 60,
    height: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 60,
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
  mainMap: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
});

export default class App extends React.Component {
  render() {
    return <HomeScreen/>;
  }
}


