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
import IconButton from './components/IconButton/IconButton';
import GroundMapView from './components/GroundMapView/GroundMapView';
import UndergroundMapView
  from './components/UndergroundMapView/UndergroundMapView';
import SearchBar from './components/SearchBar/SearchBar';
import SlidingUpDetailView
  from './components/SlidingUpDetailView/SlidingUpDetailView';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Keyboard} from 'react-native';
import NavigationSwipeView from './components/NavigationSwipeView/NavigationSwipeView';


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
      navigateGround: false,
      navigateTo: null,
      hideHamburgerButton: false,
    };

    this.toggleSideBar = this.toggleSideBar.bind(this);
    this.shouldHideHamburgerButton = this.shouldHideHamburgerButton.bind(this);
  }

  toggleSideBar() {
    this.setState({sideMenuIsOpen: !this.state.sideMenuIsOpen});
    Keyboard.dismiss();
  }

  shouldHideHamburgerButton(inputStatus) {
    this.setState({hideHamburgerButton: inputStatus});
  }

  render() {
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
        <MainView shouldHideHamburgerButton={this.shouldHideHamburgerButton}/>

        {this.state.hideHamburgerButton?
          null:
          <IconButton style={[positions.hamburgerButton]} icon={'bars'} func={this.toggleSideBar} size={30}/>}
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
      searchData: [],
      navigationData: [],
      navigationDataRequested: false,
      highlightSegmentStart: 0,
      highlightSegmentEnd: 0,
    };
    this.toggleUndergroundMap = this.toggleUndergroundMap.bind(this);
    this.toggleNavigateCallback = this.toggleNavigateCallback.bind(this);
    this.setSearchData = this.setSearchData.bind(this);
    this.updateNavigationDataCallback = this.updateNavigationDataCallback.bind(this);
    this.updateSegmentStartEndCallback = this.updateSegmentStartEndCallback.bind(this);
  }

  updateNavigationDataCallback(inputData) {
    this.setState({
      navigationData: inputData,
      navigationDataRequested: true,
    });
  }

  toggleUndergroundMap() {
    this.setState({
      underground: !this.state.underground,
      detailViewOpen: false,
    });
    this.updateSlidingDetailView = this.updateSlidingDetailView.bind(this);
  }

  setSearchData(data) {
    this.setState({
      searchData: data,
    });
  }

  updateSlidingDetailView(inputEntrance) {
    this.setState({
      selectedEntrance: inputEntrance,
      detailViewOpen: !this.state.underground,
    });
  }

  updateSegmentStartEndCallback(start, end) {
    this.setState({
      highlightSegmentStart: start,
      highlightSegmentEnd: end,
    });
  }

  toggleNavigateCallback(inputEntrance, inputStatus) {
    // we also need to clear our current navigation data
    this.setState({
      navigateGround: inputStatus,
      navigateTo: inputEntrance,
      navigationData: [],
      navigationDataRequested: false,
      highlightSegmentStart: 1,
      highlightSegmentEnd: 1,
    });
    this.props.shouldHideHamburgerButton(inputStatus);
  }

  render() {
    return (
      <View style={{flex: 1, zIndex: 0}}>
        {(this.state.underground) ?
          (<UndergroundMapView/>) :
          (<GroundMapView
            selectedMarkerCallback={(input) => {
              this.updateSlidingDetailView(input);
            }}
            updateNavigationDataCallback={this.updateNavigationDataCallback}
            navigate={this.state.navigateGround}
            navigateTo={this.state.navigateTo}
            searchData={this.state.searchData}
            highlightSegmentStart={this.state.highlightSegmentStart}
            highlightSegmentEnd={this.state.highlightSegmentEnd}
          />)}
        <SlidingUpDetailView
          open={this.state.detailViewOpen}
          entrance={this.state.selectedEntrance}
          toggleNavigate={this.toggleNavigateCallback}
          hideStatusLabel={this.state.searchData.length!==0}
        />
        {this.state.navigateGround?
            null:
            <SearchBar updateSearchData={this.setSearchData}/>}
        {this.state.navigateGround?
            null:
            <RoundButton
              style={[positions.undergroundButton]}
              icon={this.state.underground ? 'level-up' : 'level-down'}
              func={this.toggleUndergroundMap}/>}
        {this.state.navigateGround?
          <NavigationSwipeView
            navigationData={this.state.navigationData}
            navigationDataRequested={this.state.navigationDataRequested}
            updateSegmentStartEndCallback={this.updateSegmentStartEndCallback}
          />:
          null
        }
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
    width: 40,
    height: 40,
  },

  hamburgerButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 60,
    height: 60,
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


