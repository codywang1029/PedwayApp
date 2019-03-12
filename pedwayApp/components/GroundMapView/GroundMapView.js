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
import RoundButton from "../RoundButton/RoundButton";
import * as polyline from 'google-polyline';


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
            updateGeoLocation: false,
            id: 0,
            navigate: false,
            navigateTo: null,
        };
        this.forwardSelectedEntrance = this.forwardSelectedEntrance.bind(this);
        this.renderPath = this.renderPath.bind(this);
        this.recenter = this.recenter.bind(this);
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

    componentWillReceiveProps(nextProps) {
        if (nextProps.navigate !== undefined) {
            this.setState({
                    navigate: nextProps.navigate,
                    navigateTo: nextProps.navigateTo,
                },
            );
            this.renderPath(nextProps.navigateTo);
        }
    }

    getGeometry(start, end) {
        axios.get('http://192.168.86.122:3000/api/ors/directions?coordinates=' + start[1] + ',%20' + start[0] + '%7C' + end[1] + ',%20' + end[0] + '&profile=foot-walking')
            .then(json => {
                const geometry = json.data.routes[0].geometry;
                const coords = polyline.decode(geometry);
                console.log(coords);
            })
            .catch(error => console.log(error));
    }


    /**
     * request the API and render a path from this.state.latitude/longitude
     * to inputEntrance's coordinate
     * @param inputEntrance
     */
    renderPath(inputEntrance) {
        // request api here

        // parse line string

        // render on map

        // remove other plots
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.state.id);
    }


    recenter() {
        const region = {
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
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
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                >
                    <RenderEntrance
                        JSONData={PedwayData}
                        callbackFunc={(input) => {
                            this.forwardSelectedEntrance(input);
                        }}/>
                    <MapView.Marker
                        coordinate={{
                            latitude: latitude,
                            longitude: longitude,
                        }}
                        style={{zIndex: 10}}
                        pinColor={'#1198ff'}
                        title={'You'}
                        image={circle}/>
                </MapView>
            </View>);

    }
}


