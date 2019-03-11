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
      pedwaySections: [],
      strokeColor: '#42b0f4',
      strokeWidth: 3,
      zIndex: 1,

    };
    this.parseJSONtoModel = this.parseJSONtoModel.bind(this);
    this.parseLineJSON = this.parseLineJSON.bind(this);
    this.parsePolygonJSON = this.parsePolygonJSON.bind(this);


  }

  parseLineJSON(inputJSON) {
    try {
      const retVal = [];
      inputJSON['geometry']['coordinates'].forEach((item) => {
        retVal.push(new PedwayCoordinate(item[1], item[0]));
      });
      return new PedwaySection(retVal);
    } catch (e) {
      return null;
    }
  }

  parsePolygonJSON(inputJSON) {
    try {
      const retVal = [];
      inputJSON['geometry']['coordinates'].forEach((itemList) => {
        const thisList = [];
        itemList.forEach((item) => {
          thisList.push(new PedwayCoordinate(item[1], item[0]));
        });
        retVal.push(new PedwaySection(thisList));
      });
      return retVal;
    } catch (e) {
      return null;
    }
  }

  parseJSONtoModel(inputJSON) {
    const paths = inputJSON['features'].filter((item) => {
      try {
        if (item['geometry']['type'] === 'LineString' ||
          item['geometry']['type'] === 'Polygon') {
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    }).reduce((acc, item) => {
      if (item['geometry']['type'] === 'LineString') {
        const thisSection = this.parseLineJSON(item);
        return (thisSection !== null) ? (acc.concat(thisSection)) : (acc);
      } else if (item['geometry']['type'] === 'Polygon') {
        const thisSection = this.parsePolygonJSON(item);
        return (thisSection !== null) ? (acc.concat(thisSection)) : (acc);
      } else {
        return acc;
      }
    }, []);
    this.setState({
      pedwaySections: paths,
    });
  }

  componentWillMount() {
    if(this.props.JSONData!==undefined) {
      this.parseJSONtoModel(this.props.JSONData);
    }
    if(this.props.strokeWidth!==undefined) {
      this.setState({
        strokeWidth: this.props.strokeWidth,
      });
    }
    if(this.props.strokeColor!==undefined) {
      this.setState({
        strokeColor: this.props.strokeColor,
      });
    }
    if(this.props.zIndex!==undefined) {
      this.setState({
        zIndex: this.props.zIndex,
      });
    }
  }

  componentWillReceiveProps(next) {
    if(this.props.JSONData!==undefined) {
      this.parseJSONtoModel(next.JSONData);
    }
  }

  render() {
    return (
      this.state.pedwaySections.map((path, idx) => {
        return (
          <Polyline
            key={idx}
            coordinates={path.getJSONList()}
            strokeColor={this.state.strokeColor}
            strokeWidth={this.state.strokeWidth}
            style={{ zIndex: this.state.zIndex }}
          />
        );
      })
    );
  }
}
