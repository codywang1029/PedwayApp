/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 * we have to use isomorphic-fetch for our test cases so there is no fetch included in jest
 */

import 'react-native';
import React from 'react';
import App from '../App';
import fetch from 'isomorphic-fetch';


// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
it('renders correctly', () => {
  renderer.create(<App />);
});

test('Dummy test case for testing purpose', () => {
  expect(1+1).toBe(2);
});
