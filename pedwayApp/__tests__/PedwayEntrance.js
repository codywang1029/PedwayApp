import PedwayEntrance from '../model/PedwayEntrance';
import PedwayCoordinate from '../model/PedwayCoordinate';

test('Check Entrance Constructor', () => {
  const testCoord = new PedwayCoordinate(-70.20232, 42.353523);
  expect(testCoord !== null);
  const testEntrance = new PedwayEntrance(testCoord, 'open', false);
  expect(testEntrance !== null);
});

test('Check Coordinate Getter', () => {
  const testCoord = new PedwayCoordinate(-70.20232, 42.353523);
  expect(testCoord !== null);
  const testEntrance = new PedwayEntrance(testCoord, 'open', false);
  expect(testCoord).toEqual(testEntrance.getCoordinate());
});

test('Check Status Getter', () => {
  const testCoord = new PedwayCoordinate(-70.20232, 42.353523);
  const testEntrance = new PedwayEntrance(testCoord, 'open', false);
  expect(testEntrance.getStatus()).toBe('open');
});

test('Check Elevator Getter', () => {
  const testCoord = new PedwayCoordinate(-70.20232, 42.353523);
  const testEntrance = new PedwayEntrance(testCoord, 'open', false);
  expect(testEntrance.getElevatorAvailability()).toBe(false);
});

test('Check Coordinate Setter', () => {
  const testCoord = new PedwayCoordinate(-70.20232, 42.353523);
  const testCoord2 = new PedwayCoordinate(70.20232, -42.353523);
  const testEntrance = new PedwayEntrance(testCoord, 'open', false);
  expect(testCoord).toEqual(testEntrance.getCoordinate());
  expect(testCoord2).not.toEqual(testEntrance.getCoordinate());
  testEntrance.setCoordinate(testCoord2);
  expect(testCoord).not.toEqual(testEntrance.getCoordinate());
  expect(testCoord2).toEqual(testEntrance.getCoordinate());
});

test('Check Status Setter', () => {
  const testCoord = new PedwayCoordinate(-70.20232, 42.353523);
  const testEntrance = new PedwayEntrance(testCoord, 'open', false);
  expect(testEntrance.getStatus()).toBe('open');
  testEntrance.setStatus('closed');
  expect(testEntrance.getStatus()).toBe('closed');
});

test('Check Coordinate Setter', () => {
  const testVar = new PedwayCoordinate(42, 42);
  testVar.setCoordinates(-70.20232, 42.353523);
  expect(testVar.getLatitude()).toBeCloseTo(-70.20232);
  expect(testVar.getLongitude()).toBeCloseTo(42.353523);
});

