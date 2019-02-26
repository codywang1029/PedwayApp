import 'react-native';
import React from 'react';
import APIManager from '../APIManager';
// Test case for this part is under construction

test('Dummy test case for testing purpose', () => {
  APIManager.getInstance().saveToDataBase({name: 'testObject', properties: {text: 'string'}},
    {text: 'abcd'});
  console.log('testCase Started');
  let getEmptyList = APIManager.getInstance().readFromDataBase(0);
  expect(getEmptyList.length).toBe(0);
  console.log('testCase Ended');
});
