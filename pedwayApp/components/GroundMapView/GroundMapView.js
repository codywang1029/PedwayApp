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
        latitude: -88.224916,
        longitude: 40.113918,
        error: null
    };
  }
    componentDidMount() {

          navigator.geolocation.getCurrentPosition(
              (position) => {
                  console.log(position.coords);
                  this.setState({
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude,
                      error: null,
                  });
              },
              (error) => this.setState({ error: error.message }),
              { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
          );
     
    }

  render() {
      const latitude = this.state.latitude;
      const longitude = this.state.longitude;
      console.log(latitude);
    return (
      <MapView
        style={styles.mainMap}
        mapType={MAP_TYPES.NONE}
        provider={null}
        region={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
        }}>
        <UrlTile urlTemplate={this.state.apiServerURL}/>
        <MapView.Marker
          coordinate={{
            latitude: latitude,
            longitude: longitude,
          }}
          pinColor={"#1198ff"}
          title={'You'}
        />
      </MapView>
    );
  }
}
