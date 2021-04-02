import IntersectResult from "./IntersectResult";

export default class Union {
  constructor (geometries) {
    this.geometries = geometries;
  }
  initialize () {
    for (let i in this.geometries)
      this.geometries[i].initialize();
  }

  intersect (ray) {
    let minDistance = Infinity;
    let minResult = IntersectResult.noHit;
    for (let i in this.geometries) {
      const result = this.geometries[i].intersect(ray);
      if (result.geometry && result.distance < minDistance) {
        minDistance = result.distance;
        minResult = result;
      }
    }
    return minResult;
  }
}
