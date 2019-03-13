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
    this.props.startNavigate(this.state.entrance);
    this.setState({
      navigate: !this.state.navigate,
    });
  }

  render() {
    if (this.state.entrance !== undefined && this.state.entrance !== null) {
      return (
        <SlidingUpPanel
          draggableRange={{top: 150, bottom: 0}}
          showBackdrop={false}
          ref={thisView => {
            this.detailView = thisView;
          }}
        >
          <View style={styles.backgroundView}>
            <Text style={styles.entranceLabel}>
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
            <StatusLabel
              text={this.state.entrance.getStatus() ? 'open' : 'closed'}/>
            <Text style={styles.coordinateText}>
              {this.state.entrance.getCoordinate().getLatitude() + ', '
              + this.state.entrance.getCoordinate().getLongitude()}
            </Text>
          </View>
        </SlidingUpPanel>
      );
    } else {
      return (
        <SlidingUpPanel
          draggableRange={{top: 150, bottom: 0}}
          showBackdrop={false}
          ref={thisView => {
            this.detailView = thisView;
          }}
        ></SlidingUpPanel>
      );
    }
  }
}

class StatusLabel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labelText: 'open',
    };
  }

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
