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
import {point, lineString} from '@turf/helpers';
import {pointToLineDistance} from '@turf/point-to-line-distance';

/**
 * Renders a MapView that display the ground level map
 * we are setting provider to null and UrlTile to OpenStreetMap's API
 * to use OSM
 * If highlight segment is true, highlight color used for indexes within start and end
 * If greyscale is also true, grey scale color will be used for indexes < start index
 */
export default class GroundMapView extends React.Component {
  constructor() {
    super();
    this.state = {
      apiServerURL: 'http://a.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png',
      latitude: 41.881898,
      longitude: -87.623977,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
      error: null,
      pedwayData: PedwayData,
      updateGeoLocation: true,
      id: 0,
      navigate: false,
      navigateTo: null,
      navigateDataRequested: false,
      navigateJSON: null,
      searchData: [],
      navigateList: [],
      highlightSegment: true,
      greyScaleSegment: true,
      highlightSegmentStart: 0,
      highlightSegmentEnd: 1,
      strokeColor: '#234ca0',
      highlightStrokeColor: '#4185F4',
      greyScaleStrokeColor: '#777',
      mapInFocus: true,

    };
    this.forwardSelectedEntrance = this.forwardSelectedEntrance.bind(this);
    this.renderPath = this.renderPath.bind(this);
    this.requestEntranceData = this.requestEntranceData.bind(this);
    this.recenter = this.recenter.bind(this);
    this.getGeometry = this.getGeometry.bind(this);
    this.renderMarkers =this.renderMarkers.bind(this);
    this.setSearchData = this.setSearchData.bind(this);
    this.getCurrentClosestSegment = this.getCurrentClosestSegment.bind(this);
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
              // we need to detect if the user deviate from the path here, if so, request path
              // this.getGeometry([this.state.latitude, this.state.longitude],
              //     [this.state.navigateTo.getCoordinate().getLatitude(), this.state.navigateTo.getCoordinate().getLongitude()]);
              // CODE HERE
              if (this.state.mapInFocus) {
                const region = {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  latitudeDelta: this.state.longitudeDelta,
                  longitudeDelta: this.state.latitudeDelta,
                };
                this.map.animateToRegion(region, 1000);
                // if the user is still in route, we just need to update his current section to the closest section
                if (this.state.navigateJSON!==undefined && this.state.navigateJSON!==null) {
                  // here we need to check which of the line section is the user currently closest to
                  // then set that section to the swiper view's props and update this state's segment start and end
                  console.log(this.state.navigateJSON);
                  let [closestSegment, segmentIdx] = this.getCurrentClosestSegment(position.coords.latitude, position.coords.longitude);
                  this.setState({
                    highlightSegmentStart: closestSegment['way_points'][0],
                    highlightSegmentEnd: closestSegment['way_points'][1],
                  });
                }
              }
            }
          });
    }
  }

  getCurrentClosestSegment(longitude, latitude) {
    let segmentList = this.state.navigateJSON['data']['routes']['segments'][0]['steps'];
    
    return undefined;
  }

  forwardSelectedEntrance(inputEntrance) {
    Keyboard.dismiss();
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
      });

      if (nextProps.navigate === false) {
        this.setState({
          navigate: false,
        });
      } else {
        this.setState({
          highlightSegmentStart: nextProps.highlightSegmentStart,
          highlightSegmentEnd: nextProps.highlightSegmentEnd,
          navigate: true,
        });
        if (nextProps.navigateTo !== this.state.navigateTo) {
          this.renderPath(nextProps.navigateTo);
        }
      }
    }
  }

  getGeometry(start, end) {
    return axios.get(
        'https://pedway.azurewebsites.net/api/ors/directions?coordinates=' + start[1] + ',%20' + start[0] + '%7C' + end[1] + ',%20' + end[0] + '&profile=foot-walking')
        .then((json) => {
          this.props.updateNavigationDataCallback(json);
          this.state.navigateJSON = json;
          const geometry = json.data.routes[0].geometry;
          const coords = polyline.decode(geometry);
          let retList = [];
          coords.forEach((item)=>{
            retList.push(new PedwayCoordinate(item[0], item[1]));
          });
          let retSection = new PedwaySection(retList);
          this.setState({
            navigateDataRequested: true,
            navigateList: retSection,
          });
        })
        .catch((error) => console.log(error));
  }


  /**
   * request the API and render a path from this.state.latitude/longitude
   * to destinationCoordinate's coordinate
   * @param destinationCoordinate
   */
  renderPath(destinationCoordinate) {
    this.getGeometry([this.state.latitude, this.state.longitude],
        [destinationCoordinate.getCoordinate().getLatitude(), destinationCoordinate.getCoordinate().getLongitude()]);
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.state.id);
  }


  renderMarkers() {
    if (this.state.searchData.length===0) {
      return (<RenderEntrance
        JSONData={this.state.pedwayData}
        callbackFunc={(input) => {
          this.forwardSelectedEntrance(input);
        }}/>);
    } else {
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
    let pathToGo = [];
    let pathHighlight = [];
    let pathGreyScale = [];
    if (this.state.navigateDataRequested) {
      pathToGo = this.state.navigateList.getJSONList();
      if (this.state.highlightSegment) {
        pathHighlight = pathToGo.slice(this.state.highlightSegmentStart - 1, this.state.highlightSegmentEnd);
        if (this.state.greyScaleSegment) {
          pathGreyScale = pathToGo.slice(0, this.state.highlightSegmentStart);
        }
        pathToGo = pathToGo.slice(this.state.highlightSegmentEnd - 1);
      }
    }
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
          {this.state.navigate===true?
            <View>
              <Polyline
                coordinates={pathToGo}
                strokeColor={this.state.strokeColor}
                strokeWidth={5}
                style={{zIndex: 100000}}
              />
              <Polyline
                coordinates={pathHighlight}
                strokeColor={this.state.highlightStrokeColor}
                strokeWidth={6}
                style={{zIndex: 100000}}
              />
              <Polyline
                coordinates={pathGreyScale}
                strokeColor={this.state.greyScaleStrokeColor}
                strokeWidth={5}
                style={{zIndex: 100000}}
              />
            </View>:(this.state.searchData.length===0?<RenderEntrance
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
      </View>);
  }
}


