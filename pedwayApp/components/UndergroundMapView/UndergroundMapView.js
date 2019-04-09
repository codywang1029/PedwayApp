import React, {Component} from 'react';
import styles from './styles';
import MapView, {MAP_TYPES, UrlTile, Callout} from 'react-native-maps';
import {Platform, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import RenderPedway from '../RenderPedway/RenderPedway';
import MapStyle from './mapStyleDark';
import PedwayEntrances from '../../mock_data/export.json';
import PedwaySections from '../../mock_data/sections';
import circle from '../../media/pedwayEntranceMarker.png';
import RoundButton from '../RoundButton/RoundButton';
import RenderEntrance from '../RenderEntrance/RenderEntrance';
import RenderAttractions from '../RenderAttractions/RenderAttractions';
import Attractions from '../../mock_data/attractions';

/**
 * Renders a MapView that displays the underground level map.
 * We are setting the provider to null and UrlTile to OpenStreetMap's
 * API to use OSM
 */
export default class GroundMapView extends React.Component {
  constructor() {
    super();
    this.state = {
      apiServerURL: 'http://a.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png',
      latitude: 41.881898,
      longitude: -87.623977,
      error: null,
      updateGeoLocation: true,
      id: 0,
    };
    this.recenter = this.recenter.bind(this);
    this.handleOnPress = this.handleOnPress.bind(this);
  }

  handleOnPress() {
  }

  componentDidMount() {
    if (this.state.updateGeoLocation) {
      let id = navigator.geolocation.watchPosition(
          (position) => {
            this.setState({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              error: null,
              id: id,
            });
          },
          (error) => this.setState({error: error.message}),
          {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
      );
    }
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.state.id);
  }


  recenter() {
    const region = {
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };
    this.map.animateToRegion(region, 1000);
  }

  render() {
    const latitude = this.state.latitude;
    const longitude = this.state.longitude;
    return (
      <View style={StyleSheet.absoluteFillObject}>
        <RoundButton
          style={[styles.focusButton]}
          icon={'crosshairs'}
          func={this.recenter}/>
        <MapView
          ref={(mapView) => {
            this.map = mapView;
          }}
          style={styles.mainMap}
          customMapStyle={MapStyle}
          // mapType={MAP_TYPES.NONE}
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
        >
          <RenderEntrance
            JSONData={PedwayEntrances}
            callbackFunc={(input) => {
              this.forwardSelectedEntrance(input);
            }}/>
          <MapView.Marker
            coordinate={{
              latitude: latitude,
              longitude: longitude,
            }}
            pinColor={'#1198ff'}
            title={'You'}
            image={circle}
          />
          <RenderPedway JSONData={PedwaySections}/>
          <RenderAttractions JSONData={Attractions}/>

        </MapView>
      </View>
    );
  }
}
