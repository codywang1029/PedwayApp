/**
 * adding mocks for libraries we are using
 * we disabled eslint in some part of the mock function since it is requiring
 * us to write comments explaining the usage of each individual mock function
 */
import mocks from 'react-native-jest-mocks';

mocks.initAll();

jest.mock('react-native-maps', () => {
  const React = require.requireActual('react');

  /* eslint-disable */
  class RetMockMapView extends React.Component {
    render() {
      return React.createElement('MapView', this.props, this.props.children);
    }
  }


  class RetMockUrlTile extends React.Component {
    render() {
      return React.createElement('UrlTile', this.props, this.props.children);
    }
  }

  RetMockMapView.UrlTile = RetMockUrlTile;


  class RetMockCallout extends React.Component {
    render() {
      return React.createElement('Callout', this.props, this.props.children);
    }
  }

  RetMockMapView.Callout = RetMockCallout;


  class RetMockMarker extends React.Component {
    render() {
      return React.createElement('Marker', this.props, this.props.children);
    }
  }

  RetMockMapView.Marker = RetMockMarker;


  class RetMockPolyline extends React.Component {
    render() {
      return React.createElement('Polyline', this.props, this.props.children);
    }
  }

  RetMockMapView.Polyline = RetMockPolyline;

  class RetMockMapType extends React.Component {
    render() {
      return React.createElement('MAP_TYPES', this.props, this.props.children);
    }
  }

  RetMockMapView.MAP_TYPES = RetMockMapType;


  /* eslint-enable */
  return RetMockMapView;
});


jest.mock('react-native-gesture-handler', () => {
});


jest.mock('rn-sliding-up-panel', () => {
  const React = require.requireActual('react');

  /* eslint-disable */
  class RetMockSlidingUpPanel extends React.Component {
    render() {
      return React.createElement('SlidingUpPanel', this.props, this.props.children);
    }
  }

  /* eslint-enable */
  return RetMockSlidingUpPanel;
});

