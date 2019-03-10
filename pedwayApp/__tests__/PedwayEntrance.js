import PedwayEntrance from '../modal/PedwayEntrance';
import PedwayCoordinate from '../modal/PedwayCoordinate';

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
  expect(testCoord === testEntrance.getCoordinate());
});

test('Check Status Getter', () => {
  const testCoord = new PedwayCoordinate(-70.20232, 42.353523);
  const testEntrance = new PedwayEntrance(testCoord, 'open', false);
  expect('open' == testEntrance.getStatus());
});

test('Check Elevator Getter', () => {
  const testCoord = new PedwayCoordinate(-70.20232, 42.353523);
  const testEntrance = new PedwayEntrance(testCoord, 'open', false);
  expect(false == testEntrance.getElevatorAvailability());
});

test('Check Coordinate Setter', () => {
  const testCoord = new PedwayCoordinate(-70.20232, 42.353523);
  const testCoord2 = new PedwayCoordinate(70.20232, -42.353523);
  const testEntrance = new PedwayEntrance(testCoord, 'open', false);
  expect(testCoord === testEntrance.getCoordinate());
  expect(testCoord2 !== testEntrance.getCoordinate());
  testEntrance.setCoordinate(testCoord2);
  expect(testCoord !== testEntrance.getCoordinate());
  expect(testCoord2 === testEntrance.getCoordinate());
});

test('Check Status Setter', () => {
  const testCoord = new PedwayCoordinate(-70.20232, 42.353523);
  const testEntrance = new PedwayEntrance(testCoord, 'open', false);
  expect('open' == testEntrance.getStatus());
  testEntrance.setStatus('closed');
  expect('closed' == testEntrance.getStatus());

});

test('Check Coordinate Setter', () => {
  const testVar = new PedwayCoordinate(42, 42);
  expect(testVar.getLatitdue() == 42);
  expect(testVar.getLongitude() == 42);
  testVar.setCoordinates(-70.20232, 42.353523);
  expect(testVar.getLatitdue() == -70.20232);
  expect(testVar.getLongitude() == 42.353523);
});

test('Check Elevator Setter', () => {
  const testCoord = new PedwayCoordinate(-70.20232, 42.353523);
  const testEntrance = new PedwayEntrance(testCoord, 'open', false);
  testEntrance.setElevator(true);
  expect(true == testEntrance.getElevatorAvailability());
});

test('Check get JSON', () => {
  const testVar = new PedwayCoordinate(42, 42);
  const testEntrance = new PedwayEntrance(testVar, 'open', false);
  expect(testEntrance.getJSON() == {
    coordinate: {latitude: 42, longitude: 42},
    status: 'open',
    elevator: false
  });
});
