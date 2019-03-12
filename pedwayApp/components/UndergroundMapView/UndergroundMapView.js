import React, {Component} from 'react';
import styles from './styles';
import MapView, {MAP_TYPES, UrlTile} from 'react-native-maps';
import RenderPedway from '../RenderPedway/RenderPedway';
import MapStyle from './mapStyleDark';
import PedwayData from '../../mock_data/sections';

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
      latitude:  41.884243,
      longitude: -87.626936,
      error: null,
      pedwayData: PedwayData,

    };
  }

  render() {
    const latitude = this.state.latitude;
    const longitude = this.state.longitude;
    return (
      <MapView
        style={styles.mainMap}
        customMapStyle={MapStyle}
        // mapType={MAP_TYPES.NONE}
        region={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.012,
          longitudeDelta: 0.012,
        }}>
        {/*<UrlTile urlTemplate={this.state.apiServerURL}/>*/}
        <MapView.Marker
          coordinate={{
            latitude: latitude,
            longitude: longitude,
          }}
          pinColor={'#1198ff'}
          title={'You'}
        />
        <RenderPedway JSONData={PedwayData}/>
      </MapView>
    );
  }
}
