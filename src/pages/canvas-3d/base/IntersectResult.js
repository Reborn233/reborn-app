import Vector3 from './Vector3';
export default class IntersectResult {
  static noHit = new IntersectResult();
  constructor () {
    this.geometry = null;
    this.distance = 0;
    this.position = Vector3.zero;
    this.normal = Vector3.zero;
  }

}
