import IntersectResult from "./IntersectResult";

export default class Plane {
  constructor (normal, d) {
    this.normal = normal;
    this.d = d;
  }

  copy () {
    return new Plane(this.normal.copy(), this.d);
  }

  initialize () {
    this.position = this.normal.multiply(this.d);
  }

  intersect (ray) {
    const a = ray.direction.dot(this.normal);
    if (a >= 0)
      return IntersectResult.noHit;

    const b = this.normal.dot(ray.origin.subtract(this.position));
    const result = new IntersectResult();
    result.geometry = this;
    result.distance = -b / a;
    result.position = ray.getPoint(result.distance);
    result.normal = this.normal;
    return result;
  }
}
