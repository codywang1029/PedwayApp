import React, {Component} from 'react';
import styles from './styles';
import {Image, Platform, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import MapView, {
  MAP_TYPES,
  UrlTile,
  Callout,
  Polyline,
} from 'react-native-maps';
import RenderPedway from '../RenderPedway/RenderPedway';
import MapStyle from './mapStyleDark';
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
import PedwaySections from '../../mock_data/sections';
import {point, lineString} from '@turf/helpers';
import distance from '@turf/distance';
import pointToLineDistance from '@turf/point-to-line-distance';


const AZURE_API = 'https://pedway.azurewebsites.net/api/pedway';
const ORS_API = 'https://api.openrouteservice.org';

const INITIAL_LATITUDE = 41.881898;
const INITIAL_LONGITUDE = -87.623977;
const INITIAL_DELTA = 0.007;
const RECENTER_DELTA = 0.005;

let isUserInitiatedRegionChange = false;

/**
 * Renders a MapView that display the ground level map
 * we are setting provider to null and UrlTile to OpenStreetMap's API
 * to use OSM
 * If highlight segment is true, highlight color used for indexes within start and end
 * If greyscale is also true, grey scale color will be used for indexes < start index
 * The initial highlight segment is 0 to 1, only highlighting the first line in a route
 */
export default class GroundMapView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: INITIAL_LATITUDE,
      longitude: INITIAL_LONGITUDE,
      latitudeDelta: RECENTER_DELTA,
      longitudeDelta: RECENTER_DELTA,
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
      underground: this.props.underground?false:this.props.underground,
      mapReady: false,
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
    this.setMapInFocus = this.setMapInFocus.bind(this);
    this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this);
    this.mapOnPanDrag = this.mapOnPanDrag.bind(this);
    this.updateCurrentSegment = this.updateCurrentSegment.bind(this);
    this.positionDidUpdateCallback = this.positionDidUpdateCallback.bind(this);
  }

  /**
   * Fetch the pedway entrance geoJSON data from the back end
   */
  requestEntranceData() {
    axios.get(AZURE_API + '/api/pedway/entrance').then((res) => {
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

  setMapInFocus(input) {
    this.setState({
      mapInFocus: input,
    });
  }

  /**
   * callBack function for refocusing the map and navigation whenever user position is updated
   * @param position
   * @param id reference for the listener (so we can unmount it)
   */
  positionDidUpdateCallback(position, id) {
    this.setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      error: null,
      pedwayData: PedwayData,
      id: id,
    });
    if (this.state.navigate) {
      if (this.state.mapInFocus) {
        const region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: this.state.longitudeDelta,
          longitudeDelta: this.state.latitudeDelta,
        };

        this.map.animateToRegion(region, 1000);
        // update the current segment for the swiper view and navigation path while navigating
        this.updateCurrentSegment(position.coords.longitude, position.coords.latitude);
      }
    }
  }

  componentDidMount() {
    let id = navigator.geolocation.watchPosition(
        (position) => {
          this.positionDidUpdateCallback(position, id);
        });
  }

  /**
   * this function is called when user is navigation. Update the user's current segment
   * @param longitude
   * @param latitude
   */
  updateCurrentSegment(longitude, latitude) {
    // if the user is still in route, we just need to update his current section to the closest section
    if (this.state.navigateJSON!==undefined && this.state.navigateJSON!==null) {
      // here we need to check which of the line section is the user currently closest to
      // then set that section to the swiper view's props and update this state's segment start and end
      let [closestSegment, segmentIdx] = this.getCurrentClosestSegment(longitude, latitude);
      this.setState({
        highlightSegmentStart: closestSegment['way_points'][0],
        highlightSegmentEnd: closestSegment['way_points'][1],
      });
      // we also need to update the current index for the swiper view
      this.props.updateSwiperViewIndex(segmentIdx);
    }
  }

  /**
   * Helper for updateCurrentSegment, use turf to calculate the user's closest segment in navigation path
   * Take in user's current location and parses the user's current route from geoJSON representation into
   * turf data structure.
   * Then we can use the pointToLineDistance() method from turf to find out what step is the user currently
   * on in his/her route
   * We then return that closest segment and the index of that segment in the list
   * @param longitude
   * @param latitude
   * @returns {*[]}
   */
  getCurrentClosestSegment(longitude, latitude) {
    let navigateRoute = this.state.navigateJSON['data']['routes'][0];
    let segmentList = navigateRoute['segments'][0]['steps'];
    let closestSegmentIdx = 0;
    let closestDistanceOverall = Number.MAX_VALUE;
    segmentList.forEach((item, idx) => {
      if (item['way_points'][0]===item['way_points'][1]) {
        return;
      }

      let thisItemClosestDisance = Number.MAX_VALUE;
      let thisLineSection = this.state.navigateList['coordinates'].slice(item['way_points'][0], item['way_points'][1] + 1);

      let currentLineArray = thisLineSection.map((item) => {
        return [item['longitude'], item['latitude']];
      }).reduce((acc, item) => {
        return acc.concat([item]);
      }, []);

      let currentLine = lineString(currentLineArray);
      let currentPoint = point([longitude, latitude]);
      let currentDistance = pointToLineDistance(currentPoint, currentLine);

      if (currentDistance < thisItemClosestDisance) {
        thisItemClosestDisance = currentDistance;
      }

      if (thisItemClosestDisance < closestDistanceOverall) {
        closestDistanceOverall = thisItemClosestDisance;
        closestSegmentIdx = idx;
      }
    });
    return [segmentList[closestSegmentIdx], closestSegmentIdx];
  }

  forwardSelectedEntrance(inputEntrance) {
    Keyboard.dismiss();
    if (this.props.selectedMarkerCallback !== undefined) {
      this.props.selectedMarkerCallback(inputEntrance);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setSearchData(nextProps.searchData);
    if (nextProps.underground !== this.state.underground && nextProps.underground) {
      this.setState({mapReady: false});
    }
    this.setState({underground: nextProps.underground});
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

  /**
   * fetch the directions data if the user what to start navigate
   * @param start
   * @param end
   * @returns {Promise<AxiosResponse<any> | never | void>}
   */
  getGeometry(start, end) {
    // https://pedway.azurewebsites.net/api/ors/directions?coordinates=
    return axios.get(
        ORS_API + '/directions?' +
      'api_key=apiKeyPlaceHolder='
      + start[1] + ',%20' + start[0] + '%7C' + end[1] + ',%20' + end[0] + '&profile=foot-walking')
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
   * the latitdueDelta is the difference between max/min latitdue within a view frame
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
      latitudeDelta: RECENTER_DELTA,
      longitudeDelta: RECENTER_DELTA,
    };
    this.setState({
      mapInFocus: true,
    });
    this.map.animateToRegion(region, 1000);
    this.updateCurrentSegment(this.state.longitude, this.state.latitude);
  }

  /**
   * callback function that is trigger whenever the map completes a region change
   * if the map is uninitialized, the initial location is (0,0)
   * only after the inital region change is completely, we can set mapReady to true
   * and render the components on the map
   * We also use this function together with mapOnPanDrag() to determine if a region
   * change is trigger by the user or done programmatically
   */
  onRegionChangeComplete() {
    if (!this.state.mapReady) {
      this.setState({
        mapReady: true,
      });
    }

    if (isUserInitiatedRegionChange) {
      this.setState({
        mapInFocus: false,
      });
    }
    isUserInitiatedRegionChange = false;
  }

  /**
   * this function gets called whenever user drags the map
   * we use this function together with onRegionChangeComplete() to determine if
   * the region change is done by the user or not
   * the latitdueDelta is the difference between max/min latitdue within a view frame
   */
  mapOnPanDrag() {
    isUserInitiatedRegionChange = true;
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
        pathHighlight = pathToGo.slice(this.state.highlightSegmentStart, this.state.highlightSegmentEnd + 1);
        if (this.state.greyScaleSegment) {
          pathGreyScale = pathToGo.slice(0, this.state.highlightSegmentStart + 1);
        }
        pathToGo = pathToGo.slice(this.state.highlightSegmentEnd);
      }
    }

    return (
      <View style={StyleSheet.absoluteFillObject}>
        <RoundButton
          style={this.state.navigate?[styles.positionDown]:[styles.focusButton]}
          icon={'crosshairs'}
          func={this.recenter}/>
        <MapView

          ref={(mapView) => {
            this.map = mapView;
          }}
          style={styles.mainMap}
          key={this.state.underground}
          customMapStyle={this.state.underground? MapStyle : null}
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: INITIAL_DELTA,
            longitudeDelta: INITIAL_DELTA,
          }}
          onRegionChangeComplete={this.onRegionChangeComplete}
          onPanDrag={this.mapOnPanDrag}
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
          >
            <Image source={circle} style={{width: 25, height: 25}} />
          </MapView.Marker>

          {this.state.navigate &&
          <MapView.Marker
            coordinate={{
              latitude: this.state.navigateTo.getCoordinate().getLatitude(),
              longitude: this.state.navigateTo.getCoordinate().getLongitude(),
            }}
            style={{zIndex: 10}}
            pinColor={'#009e4c'}
          />
          }
          {this.state.underground && this.state.mapReady?
          <RenderPedway JSONData={PedwaySections}/>:null}
        </MapView>
      </View>);
  }
}


