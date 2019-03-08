import React, {Component} from 'react';
import styles from './styles';
import MapView, {MAP_TYPES, UrlTile} from 'react-native-maps';

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
    };
  }

  render() {
    return (
      <MapView
        style={styles.mainMap}
        mapType={MAP_TYPES.NONE}
        provider={null}
        region={this.props.region}>
        <UrlTile urlTemplate={this.state.apiServerURL}/>
        <MapView.Marker
          coordinate={{
            latitude: 40.114399,
            longitude: -88.223961,
          }}
          pinColor={"#1198ff"}
          title={'You'}
        />
      </MapView>
    );
  }
}
