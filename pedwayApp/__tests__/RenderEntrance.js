import RenderEntrance from '../components/RenderEntrance/RenderEntrance'
import testRenderer from 'react-test-renderer';
import React from "react";
import PedwayData from '../mock_data/export';


test('Check if our RenderPedway renders correctly', () => {
  const treeRendered = testRenderer.create(<RenderEntrance />).toJSON();
  expect(treeRendered).toMatchSnapshot();
});


test('test JSON helpers',()=>{
  const treeRendered = testRenderer.create(<RenderEntrance
    JSONData={PedwayData}/>).toJSON();
  expect(treeRendered.length).toBe(73);
})
