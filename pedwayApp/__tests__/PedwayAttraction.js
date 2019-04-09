import PedwayAttraction from '../model/PedwayAttraction';
import PedwayCoordinate from '../model/PedwayCoordinate';

test('Check Attraction Constructor', () => {
  const testCoord = new PedwayCoordinate(-70.20232, 42.353523);
  expect(testCoord !== null);
  let testAttraction = new PedwayAttraction(testCoord);
  expect(testAttraction !== null);
  testAttraction = new PedwayAttraction(testCoord, 'attraction1');
  expect(testAttraction !== null);
});

test('Check Coordinate Getter', () => {
  const testCoord = new PedwayCoordinate(-70.20232, 42.353523);
  expect(testCoord !== null);
  const testAttraction = new PedwayAttraction(testCoord);
  expect(testCoord).toEqual(testAttraction.getCoordinate());
});

test('Check Coordinate Setter', () => {
  const testCoord = new PedwayCoordinate(-70.20232, 42.353523);
  const testCoord2 = new PedwayCoordinate(70.20232, -42.353523);
  const testAttraction = new PedwayAttraction(testCoord);
  expect(testCoord).toEqual(testAttraction.getCoordinate());
  expect(testCoord2).not.toEqual(testAttraction.getCoordinate());
  testAttraction.setCoordinate(testCoord2);
  expect(testCoord).not.toEqual(testAttraction.getCoordinate());
  expect(testCoord2).toEqual(testAttraction.getCoordinate());
});

test('Check Name Getter and Setter', () => {
  const testCoord = new PedwayCoordinate(-70.20232, 42.353523);
  let testAttraction = new PedwayAttraction(testCoord);
  testAttraction.setName('Attraction 1');
  expect(testAttraction.getName()).toBe('Attraction 1');

  testAttraction = new PedwayAttraction(testCoord, 'Attraction 2');
  testAttraction.setName('Attraction 2');

  testAttraction.setName('');
  expect(testAttraction.getName()).toBe('');

  testAttraction.setName('Attraction 25');
  expect(testAttraction.getName()).toBe('Attraction 25');
});
