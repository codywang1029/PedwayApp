import React, {Component} from 'react';
import PedwayCoordinate from '../../model/PedwayCoordinate';
import PedwayEntrance from '../../model/PedwayEntrance';
import MarkerImage from '../../media/pedwayEntranceMarker.png';
import MapView, {
  Polyline,
  Marker,
} from 'react-native-maps';

/**
 * The current pedway sections are hard coded place holders
 * In the future we are gonna to get those values from the API
 * */
export default class RenderEntrance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pedwayEntrances: [],
    };
    this.parseJSONtoModel = this.parseJSONtoModel.bind(this);
  }

  parseJSONtoModel(inputJSON) {
    if (inputJSON === undefined || inputJSON['data'] === undefined) {
      return;
    }
    const entrances = inputJSON['data'].reduce((acc, item, idx) => {
      const thisLongitude = item['geometry']['coordinates'][0];
      const thisLatitude = item['geometry']['coordinates'][1];
      const thisStatus = item['status'];
      return acc.concat(
          new PedwayEntrance(new PedwayCoordinate(
              thisLatitude,
              thisLongitude), thisStatus,
          false,
          'Entrance #'+idx.toString()));
    }, []);
    this.setState({
      pedwayEntrances: entrances,
    });
  }

  componentWillMount() {
    if (this.props.JSONData!==undefined) {
      this.parseJSONtoModel(this.props.JSONData);
    }
  }

  componentWillReceiveProps(next) {
    if (next.JSONData!==undefined) {
      this.parseJSONtoModel(next.JSONData);
    }
    this.forceUpdate();
  }

  render() {
    const retMarkerList = this.state.pedwayEntrances.map((input, idx) => {
      return (
        <MapView.Marker
          coordinate={input.getCoordinate().getJSON()}
          // image={require('../../media/pedwayEntranceMarker.png')}
          key={idx}
          onPress={()=>{
            this.props.callbackFunc(this.state.pedwayEntrances[idx]);
          }}
        />
      );
    },
    );
    return (
      retMarkerList
    );
  }
}
