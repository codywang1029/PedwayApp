/**
 * modal to save a coordinates and status representing pedway entrance
 * the whole pedway is represented with a list of PedwaySections
 */
export default class PedwaySection {
  /**
   * constructor for this class
   * @param {PedwayCoordinate} inputCoordinate
   * @param {string} status
   * @param {boolean} elevator
   */
  constructor(inputCoordinate, status, elevator=false) {
    this.coordinate = inputCoordinate;
    this.status = status;
    this.elevator = elevator;
  }

  /**
   * get the coordinate
   * @return {PedwayCoordinate}
   */
  getCoordinate() {
    return this.coordinate;
  }

  /**
   * get the status
   * @return {string}
   */
  getStatus() {
    return this.status;
  }

  /**
   * get if we have elevator in this entrance
   * @return {boolean}
   */
  getElevatorAvailability() {
    return this.elevator;
  }

  /**
   * get an array of coordinates in JSON
   * @return {JSON}
   */
  getJSON() {
    return (this.coordinate.getJSON());
  }
  /**
   * update the coordinate
   * @param {PedwayCoordinate} inputCoordinate
   */
  setCoordinate(inputCoordinate) {
    this.coordinate = inputCoordinate;
  }
  /**
   * update the status
   * @param {string} status
   */
  setStatus(status) {
    this.status = status;
  }

  /**
   * update the elevator availability
   * @param {boolean} elevator
   */
  setElevator(elevator) {
    this.elevator = elevator;
  }
}
