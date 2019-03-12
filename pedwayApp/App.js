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
import RoundButton from './components/RoundButton/RoundButton';
import GroundMapView from './components/GroundMapView/GroundMapView';
import UndergroundMapView
  from './components/UndergroundMapView/UndergroundMapView';
import SearchBar from './components/SearchBar/SearchBar';
import SlidingUpDetailView
  from './components/SlidingUpDetailView/SlidingUpDetailView';
import Icon from 'react-native-vector-icons/FontAwesome';

/**
 * HomeScreen that gets rendered first when everything is loaded
 * Consists of a Sidemenu, a MainView, and a hamburger button that toggles
 * Sidemenu/MainView
 */
class HomeScreen extends React.Component {

  constructor() {
    super();
    this.state = {
      mainStatusText: 'Requesting from backend...',
      entrance1StatusText: '',
      macysStatusText: '',
      sideMenuIsOpen: false,
      sideMenuDisableGesture: true,
      apiServerURL: 'http://a.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png',
      detailViewOpen: false,
    };
  }


  render() {

    const toggleSideBar = () => {
      this.setState({sideMenuIsOpen: !this.state.sideMenuIsOpen});
    };

    const MenuComponent = (
      <View style={{flex: 1, backgroundColor: '#a9a9a9', padding: 30}}>
        <Text style={styles.item}>
          <Icon name="heart" style={styles.item}/>
          Favorites
        </Text>
        <Text style={styles.item}>
          <Icon name="bell" style={styles.item}/>
          Updates
        </Text>
        <Text style={styles.item}>
          <Icon name="users" style={styles.item}/>
          Feedback
        </Text>
        <Text style={styles.item}>
          <Icon name="gear" style={styles.item}/>
          Settings
        </Text>
      </View>
    );

    return (
      <SideMenu
        menu={MenuComponent}
        disableGestures={this.state.sideMenuDisableGesture}
        isOpen={this.state.sideMenuIsOpen}
        onChange={(openStatus) => {
          this.state.sideMenuIsOpen = openStatus;
          this.setState({sideMenuDisableGesture: !openStatus});
        }}
      >
        <RoundButton style={[positions.hamburgerButton]} icon={'bars'}
                     func={toggleSideBar}/>

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
  constructor(props) {
    super(props);
    this.state = {
      underground: false,
      selectedEntrance: null,
    };
    this.toggleUndergroundMap = this.toggleUndergroundMap.bind(this);

  }

  toggleUndergroundMap() {
    this.setState({
      underground: !this.state.underground,
      detailViewOpen: false,
    });
    this.updateSlidingDetailView = this.updateSlidingDetailView.bind(this);
  }

  updateSlidingDetailView(inputEntrance) {
    this.setState({
      selectedEntrance: inputEntrance,
      detailViewOpen: !this.state.underground,
    });

  }

  render() {
    return (
      <View style={{flex: 1}}>
        {(this.state.underground) ?
          (<UndergroundMapView/>) :
          (<GroundMapView
            selectedMarkerCallback={(input) => {
              this.updateSlidingDetailView(input);
            }}
          />)}
        <SlidingUpDetailView
          open={this.state.detailViewOpen}
          entrance={this.state.selectedEntrance}
        />
        <SearchBar/>
        <RoundButton
          style={[positions.undergroundButton]}
          icon={this.state.underground ? 'level-up' : 'level-down'}
          func={this.toggleUndergroundMap}/>
      </View>
    );
  }
}

const positions = StyleSheet.create({
  undergroundButton: {
    zIndex: 0,
    position: 'absolute',
    top: 100,
    right: 20,
  },
  hamburgerButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
});

const styles = StyleSheet.create({
  item: {
    fontSize: 30,
    fontWeight: '300',
    top: 30,
  },
});

export default class App extends React.Component {
  render() {
    return <HomeScreen/>;
  }
}


