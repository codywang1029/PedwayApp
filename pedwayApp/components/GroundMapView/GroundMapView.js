import React, {Component} from 'react';
import styles from './styles';
import {Platform, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import MapView, {
  MAP_TYPES,
  UrlTile,
  Callout,
  Polyline,
} from 'react-native-maps';
import RenderPedway from '../RenderPedway/RenderPedway';
import RenderEntrance from '../RenderEntrance/RenderEntrance';
import RenderLocation from '../RenderLocation/RenderLocation';
import MapCallout from 'react-native-maps/lib/components/MapCallout';
import circle from '../../media/pedwayEntranceMarker.png';
import axios from 'axios';
import RoundButton from '../RoundButton/RoundButton';
import * as polyline from 'google-polyline';
import PedwayData from '../../mock_data/export.json';
import PedwayCoordinate from '../../model/PedwayCoordinate';
import PedwaySection from '../../model/PedwaySection';
import {Keyboard} from 'react-native';

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
      latitude: 41.881898,
      longitude: -87.623977,
      error: null,
      pedwayData: PedwayData,
      updateGeoLocation: true,
      id: 0,
      navigate: false,
      navigateTo: null,
      searchData: [],
      navigateList: [],
    };
    this.forwardSelectedEntrance = this.forwardSelectedEntrance.bind(this);
    this.renderPath = this.renderPath.bind(this);
    this.requestEntranceData = this.requestEntranceData.bind(this);
    this.recenter = this.recenter.bind(this);
    this.getGeometry = this.getGeometry.bind(this);
    this.renderMarkers =this.renderMarkers.bind(this);
    this.setSearchData = this.setSearchData.bind(this);
  }


  requestEntranceData() {
    axios.get('https://pedway.azurewebsites.net/api/pedway/entrance').then((res) => {
      this.setState({
        pedwayData: res,
      });
    }).catch((e) => {
    },
    );
  }

  setSearchData(data) {
    this.setState({
      searchData: data,
    });
  }

  componentDidMount() {
    if (this.state.updateGeoLocation) {
      let id = navigator.geolocation.watchPosition(
          (position) => {
            this.setState({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              error: null,
              pedwayData: PedwayData,
              id: id,
            });
            if (this.state.navigate && this.state.navigateTo) {
              this.getGeometry([this.state.latitude, this.state.longitude],
                  [this.state.navigateTo.getCoordinate().getLatitude(), this.state.navigateTo.getCoordinate().getLongitude()]);
            }
          });
    }
  }


  forwardSelectedEntrance(inputEntrance) {
    if (this.props.selectedMarkerCallback !== undefined) {
      this.props.selectedMarkerCallback(inputEntrance);
    }
  }

  // this.requestEntranceData();

  componentWillReceiveProps(nextProps) {
    this.setSearchData(nextProps.searchData);

    if (nextProps.navigate !== undefined) {
      this.setState({
        navigateTo: nextProps.navigateTo,
      },
      );
      this.renderPath(nextProps.navigateTo);
    }
  }

  getGeometry(start, end) {
    return axios.get(
        'https://pedway.azurewebsites.net/api/ors/directions?coordinates=' + start[1] + ',%20' + start[0] + '%7C' + end[1] + ',%20' + end[0] + '&profile=foot-walking')
        .then((json) => {
          const geometry = json.data.routes[0].geometry;
          const coords = polyline.decode(geometry);
          let retList = [];
          coords.forEach((item)=>{
            retList.push(new PedwayCoordinate(item[0], item[1]));
          });
          let retSection = new PedwaySection(retList);
          this.setState({
            navigate: true,
            navigateList: retSection,
          });
        })
        .catch((error) => console.log(error));
  }


  /**
   * request the API and render a path from this.state.latitude/longitude
   * to inputEntrance's coordinate
   * @param inputEntrance
   */
  renderPath(inputEntrance) {
    // request api here
    // parse line string
    this.getGeometry([this.state.latitude, this.state.longitude],
        [inputEntrance.getCoordinates().getLatitude(), inputEntrance.getCoordinates().getLongitude()]);
    // render on map

    // remove other plots
  }

  /**
   * request the API and render a path from this.state.latitude/longitude
   * to inputEntrance's coordinate
   * @param inputEntrance
   */
  renderPath(inputEntrance) {
    if (this.state.navigate===false) {
      this.getGeometry([this.state.latitude, this.state.longitude],
          [inputEntrance.getCoordinate().getLatitude(), inputEntrance.getCoordinate().getLongitude()]);
    } else {
      this.setState({
        navigate: false,
      });
    }
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.state.id);
  }


  renderMarkers(){
    if (this.state.searchData.length===0){
      return (<RenderEntrance
          JSONData={this.state.pedwayData}
          callbackFunc={(input) => {
            this.forwardSelectedEntrance(input);
          }}/>);
    }
    else{
      return (<RenderLocation
          JSONData={this.state.searchData}
          callbackFunc={(input) => {
            this.forwardSelectedEntrance(input);
          }}/>);
    }
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
            initialRegion={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          >
            {this.state.navigate===true?<Polyline
                coordinates={this.state.navigateList.getJSONList()}
                strokeColor={'#AA0022'}
                strokeWidth={6}
                style={{zIndex: 100000}}
            />:(this.state.searchData.length===0?<RenderEntrance
                JSONData={this.state.pedwayData}
                callbackFunc={(input) => {
                  this.forwardSelectedEntrance(input);
                }}/>:<RenderLocation
                JSONData={this.state.searchData}
                callbackFunc={(input) => {
                  this.forwardSelectedEntrance(input);
                }}/> )}

            <MapView.Marker
              coordinate={{
                latitude: latitude,
                longitude: longitude,
              }}
              style={{zIndex: 10}}
              title={'You'}
              pinColor={'#1198ff'}
              image={circle}
            />
            {this.state.navigate===true &&
            <MapView.Marker
                coordinate={{
                  latitude: this.state.navigateTo.getCoordinate().getLatitude(),
                  longitude: this.state.navigateTo.getCoordinate().getLongitude(),
                }}
                style={{zIndex: 10}}
                pinColor={'#009e4c'}
            />
            }
          </MapView>
        </View>)

  }
}


