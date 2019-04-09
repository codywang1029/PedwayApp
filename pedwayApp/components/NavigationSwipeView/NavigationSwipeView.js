import React, {Component} from 'react';
import styles from './styles';
import {TouchableOpacity, View, ActivityIndicator, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Swiper from 'react-native-swiper';

// map of way types to icon names
// for more information checkout https://github.com/GIScience/openrouteservice-docs/blob/master/README.md
let vectorIconDisplayList = [
  'long-arrow-left',
  'long-arrow-right',
  'long-arrow-left',
  'long-arrow-right',
  'long-arrow-left',
  'long-arrow-right',
  'long-arrow-up',
  'long-arrow-up',
  'long-arrow-up',
  'long-arrow-down',
  'flag',
  'home',
  'long-arrow-left',
  'long-arrow-right',
];

export default class NavigationSwipeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navigationData: [],
      currentSegment: 0,
      dataRequested: false,
    };
    this.updateState = this.updateState.bind(this);
    this.onIndexChanged = this.onIndexChanged.bind(this);
  }

  componentDidMount() {
    this.updateState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateState(nextProps);
  }

  updateState(inputProps) {
    this.setState({
      navigationData: inputProps.navigationData,
      dataRequested: inputProps.navigationDataRequested,
    });
  }

  onIndexChanged(inputIndex) {
    try {
      let wayPoint = this.state.navigationData['data']['routes'][0]['segments'][0]['steps'][inputIndex]['way_points'];
      this.props.updateSegmentStartEndCallback(wayPoint[0], wayPoint[1]);
    } catch (e) {
    }
  }

  render() {
    if (this.state.dataRequested === false) {
      return (
        <View style={styles.outerContainer}>
          <View style={styles.innerContainer}>
            <ActivityIndicator
              size='large'
              color='#fff'
              animating={true}
              style={styles.activityIndicator}
            />
          </View>
        </View>
      );
    } else {
      // right now using the first route
      let navigationData = [];
      try {
        navigationData = this.state.navigationData['data']['routes'][0]['segments'][0]['steps'];
      } catch (e) {
      }
      let swiperViewData = navigationData.map((item, idx)=>{
        return (
          <View style={styles.rowFlexContainer} key={idx}>
            <View style={styles.iconOuterContainer}>
              <View style={styles.iconInnerContainer}>
                <Icon name={vectorIconDisplayList[item['type']]} style={styles.instructionIcon}/>
              </View>
            </View>
            <View style={styles.colFlexContainer}>
              <Text style={styles.instructionLabel} numberOfLines={3}>{item['instruction']}</Text>
              <Text style={styles.distanceLabel}>{ + (idx + 1) + '/' +
              this.state.navigationData['data']['routes'][0]['segments'][0]['steps'].length +
              '  ' + item['distance'] + 'm'}</Text>
            </View>
          </View>
        );
      });
      return (
        <View style={styles.outerContainer}>
          <View style={styles.innerContainer}>
            <Swiper loop={false} showsButton={true} showsPagination={false} onIndexChanged={this.onIndexChanged}>
              { swiperViewData }
            </Swiper>
          </View>
        </View>
      );
    }
  }
}
