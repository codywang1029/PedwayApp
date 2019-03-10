import React, {Component} from 'react';
import PedwaySection from '../../modal/PedwaySection';
import PedwayCoordinate from '../../modal/PedwayCoordinate';
import MarkerImage from '../../media/pedwayEntranceMarker.png';
import MapView, {
  Polyline,
  Marker,
} from 'react-native-maps';
import PedwayEntrance from '../../modal/PedwayEntrance';

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
    this.parseJSONtoModal = this.parseJSONtoModal.bind(this);
  }

  parseJSONtoModal(inputJSON) {
    const entrances = inputJSON['features'].filter((item) => {
      try {
        if (item['properties']['entrance'] == 'yes' &&
          item['geometry']['type'] == 'Point') {
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    }).reduce((acc, item) => {
      const thisLongitude = item['geometry']['coordinates'][0];
      const thisLatitude = item['geometry']['coordinates'][1];
      return acc.concat(
          new PedwayEntrance(new PedwayCoordinate(
              thisLatitude,
              thisLongitude),
          true,
          false));
    }, []);
    this.setState({
      pedwayEntrances: entrances,
    });
  }

  componentWillMount() {
    this.parseJSONtoModal(this.props.JSONData);
  }

  componentWillReceiveProps(next) {
    this.parseJSONtoModal(next.JSONData);
  }

  render() {
    const retMarkerList = this.state.pedwayEntrances.map((input, idx)=>{
      return(
        <MapView.Marker
          coordinate={input.getCoordinate().getJSON()}
          // image={require('../../media/pedwayEntranceMarker.png')}
          pinColor={'#1198ff'}
          key={idx}
        />
      );}
    );
    return (
      retMarkerList
    );
  }
}
