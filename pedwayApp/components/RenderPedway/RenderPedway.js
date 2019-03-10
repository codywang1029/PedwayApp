import React, {Component} from 'react';
import PedwaySection from '../../modal/PedwaySection';
import PedwayCoordinate from '../../modal/PedwayCoordinate';
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
    };
    this.parseJSONtoModal = this.parseJSONtoModal.bind(this);
    this.parseLineJSON = this.parseLineJSON.bind(this);
    this.parsePolygonJSON = this.parsePolygonJSON.bind(this);


  }

  parseLineJSON(inputJSON) {
    try {
      const retval = inputJSON['geometry']['coordinates'].reduce((acc,item,idx,array)=>{
        if(idx==array.length-1) {
          return acc;
        }
        if(array.length==1) {
          return acc;
        }
        return acc.concat(
          new PedwaySection(new PedwayCoordinate(
            item[1],
            item[0]
          ), new PedwayCoordinate(
            item[1],
            item[0]
          ))
        );
      },[]);
    } catch(e) {
      return null;
    }
  }

  parsePolygonJSON(inputJSON) {
    return [];
  }

  parseJSONtoModal(inputJSON) {
    const paths = inputJSON['features'].filter((item)=>{
      try {
        if (item['geometry']['type'] == 'LineString' ||
          item['geometry']['type'] == 'Polygon') {
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    }).reduce((acc, item) => {
      const thisLongitude = item['geometry']['coordinates'][0];
      const thisLatitude = item['geometry']['coordinates'][1];
      if(item['geometry']['type'] == 'LineString') {
        console.log('This is the log output',this.parseLineJSON(item),item);
        return acc.concat(this.parseLineJSON(item));
      } else {
        return acc

    }, []);
    this.setState({
      pedwaySections: paths,
    });
  }

  componentWillMount() {
    this.parseJSONtoModal(this.props.JSONData);
  }

  componentWillReceiveProps(next) {
    this.parseJSONtoModal(next.JSONData);
  }

  render() {
    return (
      this.state.pedwaySections.map((path, idx) => {
        console.log('test',path);
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
