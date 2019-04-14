import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import styles from './styles';
import RoundButton from '../RoundButton/RoundButton';
import SlidingUpPanel from 'rn-sliding-up-panel';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PedwayEntrance from '../../model/PedwayEntrance';


/**
 * renders a view Component that displays pedway info and user action when
 * mapMarker is clicked
 */

export default class SlidingUpDetailView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      entrance: null,
      navigateFunctor: null,
      navigate: false,
    };
    this.updateState = this.updateState.bind(this);
    this.openView = this.openView.bind(this);
    this.closeView = this.closeView.bind(this);
    this.navigateButtonOnPress = this.navigateButtonOnPress.bind(this);
  }

  updateState(inputProps) {
    if (inputProps.entrance !== undefined && inputProps.entrance !== null) {
      this.setState({
        entrance: inputProps.entrance,
      });
    }
    if (inputProps.open === true) {
      this.setState({
        open: true,
      });
      this.openView();
    }
    if (inputProps.open === false) {
      this.setState({
        open: false,
      });
      this.closeView();
    }
  }

  openView() {
    this.detailView.show();
  }

  closeView() {
    this.detailView.hide();
  }

  componentDidMount() {
    this.updateState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateState(nextProps);
  }

  navigateButtonOnPress() {
    this.props.toggleNavigate(this.state.entrance, !this.state.navigate);
    this.setState({
      navigate: !this.state.navigate,
    });
  }

  render() {
    let shouldHideStatusLabel = this.props.hideStatusLabel===true;
    if (this.state.entrance !== undefined && this.state.entrance !== null) {
      return (
        <SlidingUpPanel
          draggableRange={{top: 150, bottom: 0}}
          showBackdrop={false}
          ref={(thisView) => {
            this.detailView = thisView;
          }}
        >
          <View style={styles.aboveFlexContainer}>
            <Text
              style={styles.entranceLabel}
              numberOfLines={1}
            >
              {this.state.entrance.getName()}
            </Text>
            <View style={styles.routeButtonContainer}>
              <TouchableOpacity
                style={styles.routeBackgroundContainer}
                onPress={() => {
                  this.navigateButtonOnPress();
                }}
              >
                <Icon
                  style={styles.routeButton}
                  name={this.state.navigate?'rotate-left':'directions-walk'}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.backgroundView}>
            <View style={styles.belowFlexContainer}>
              <View style={styles.belowFlex}>
                {shouldHideStatusLabel?
                null:
                <StatusLabel
                  text={this.state.entrance.getStatus()}/>
                }
                <Text style={styles.coordinateText}>
                  {this.state.entrance.getCoordinate().getLatitude() + ', '
                  + this.state.entrance.getCoordinate().getLongitude()}
                </Text>
              </View>
            </View>
          </View>
        </SlidingUpPanel>
      );
    } else {
      return (
        <SlidingUpPanel
          draggableRange={{top: 150, bottom: 0}}
          showBackdrop={false}
          ref={(thisView) => {
            this.detailView = thisView;
          }}/>
      );
    }
  }
}

class StatusLabel extends Component {
  render() {
    if (this.props.text === 'open') {
      return (
        <View style={[styles.statusLabelContainer, styles.statusLabelGreen]}>
          <Text style={styles.statusLabelText}>
            Open
          </Text>
        </View>
      );
    } else if (this.props.text === 'closed') {
      return (
        <View style={[styles.statusLabelContainer, styles.statusLabelRed]}>
          <Text style={styles.statusLabelText}>
            Closed
          </Text>
        </View>
      );
    } else {
      return (
        <View style={[styles.statusLabelContainer, styles.statusLabelGrey]}>
          <Text style={styles.statusLabelText}>
            Undefined
          </Text>
        </View>
      );
    }
  }
}
