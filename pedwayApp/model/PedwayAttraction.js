/**
 * Model to save coordinates representing Pedway attractions
 */
export default class PedwayAttraction {
  /**
     * Constructor for PedwayAttraction
     * @param {PedwayCoordinate} inputCoordinate
     * @param {string} name
     */
  constructor(inputCoordinate, name = '') {
    this.coordinate = inputCoordinate;
    this.name = name;
  }

  /**
     * Getter for a coordinate
     * @return {PedwayCoordinate}
     */
  getCoordinate() {
    return this.coordinate;
  }

  /**
     * Get an array of coordinates in JSON format
     * @return {JSON}
     */
  getJSON() {
    return ({
      coordinate: this.coordinate.getJSON(),
    });
  }

  /**
     * Setter for a coordinate
     * @param {PedwayCoordinate} inputCoordinate
     */
  setCoordinate(inputCoordinate) {
    this.coordinate = inputCoordinate;
  }

  /**
     * Setter for the name of the attraction
     * @param {string} name
     */
  setName(name) {
    this.name = name;
  }

  /**
     * Getter for the name of the attraction
     * @return {string} name
     */
  getName() {
    return this.name;
  }
}

