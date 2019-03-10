import React, {Component} from 'react';
import PedwaySection from '../../model/PedwaySection';
import PedwayCoordinate from '../../model/PedwayCoordinate';
import MapView, {
  Polyline,
} from 'react-native-maps';

/**
 * The current pedway sections are hard coded place holders
 * In the future we are gonna to get those values from the API
 * */
export default class RenderPedway extends Component {

  constructor(props) {
    super(props);
    let section1 = new PedwaySection([new PedwayCoordinate(40.143, -88.231),
      new PedwayCoordinate(40.0953, -88.255462), new PedwayCoordinate(40.068305, -88.205)]);
    let section2 = new PedwaySection([new PedwayCoordinate(40.116300, -88.2737),
      new PedwayCoordinate(40.116329, -88.224462)]);
    this.state = {
      pedwaySections: [section1, section2],
    };
  }

  render() {
    return (
      this.state.pedwaySections.map((path, idx) => {
        return (
          <MapView.Polyline
            key={idx}
            coordinates={path.getJSONList()}
            strokeColor='#42b0f4'
            strokeWidth={3}
          />
        );
      })
    );
  }
}
