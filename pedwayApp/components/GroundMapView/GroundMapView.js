import React, {Component} from 'react';
import styles from './styles';
import {Platform, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import MapView, {MAP_TYPES, UrlTile, Callout} from 'react-native-maps';
import RenderPedway from '../RenderPedway/RenderPedway';
import RenderEntrance from '../RenderEntrance/RenderEntrance';
import PedwayData from '../../mock_data/export';
import MapCallout from 'react-native-maps/lib/components/MapCallout';
import circle from '../../media/pedwayEntranceMarker.png';
import axios from 'axios';

/**
 * Renders a MapView that display the ground level map
 * we are setting provider to null and UrlTile to OpenStreetMap's API
 * to use OSM
 */
export default class GroundMapView extends React.Component {

  constructor() {
    super();
    this.state = {
      apiServerURL: 'http://a.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png',
      latitude: 41.88189833333333,
      longitude: -87.623977,
      error: null,
      pedwayData: PedwayData,
      updateGeoLocation: true,
      id: 0,
    };
    this.forwardSelectedEntrance = this.forwardSelectedEntrance.bind(this);
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
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
      );
    }
  }

  forwardSelectedEntrance(inputEntrance) {
    if (this.props.selectedMarkerCallback !== undefined) {
      this.props.selectedMarkerCallback(inputEntrance);
    }
  }

  getGeometry(start, end) {
    axios.get('http://localhost:3000/api/ors/directions?coordinates=' + start[1] + ',%20' + start[0] + '%7C' + end[1] + ',%20' + end[0] + '&profile=foot-walking')
      .then(json => console.log(json));
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.state.id);
  }

  render() {
    const latitude = this.state.latitude;
    const longitude = this.state.longitude;
    this.getGeometry([latitude, longitude], [41.881899, -83.633977]);
    return (
      <MapView
        style={styles.mainMap}
        // mapType={MAP_TYPES.NONE}
        // bug fixes, or else cause region to reset whenever opress
        // reference: https://github.com/react-native-community/react-native-maps/issues/2308
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <RenderEntrance
          JSONData={PedwayData}
          callbackFunc={(input) => {
            this.forwardSelectedEntrance(input);
          }}/>
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
        }}>
        {/*<UrlTile urlTemplate={this.state.apiServerURL}/>*/}
        <MapView.Marker
          coordinate={{
            latitude: latitude,
            longitude: longitude,
          }}
          style={{zIndex: 10}}
          pinColor={'#1198ff'}
          title={'You'}
          image={circle}
        />
        <RenderEntrance JSONData={PedwayData}/>
      </MapView>
    );
  }
}


