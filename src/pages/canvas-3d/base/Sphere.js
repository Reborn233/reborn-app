import IntersectResult from './IntersectResult'
export default class Sphere {
  constructor (center, radius) {
    this.center = center;
    this.radius = radius;
    this.sqrRadius = radius * radius;
  }

  copy () {
    return new Sphere(this.center.copy(), this.radius.copy());
  }

  initialize () {
    this.sqrRadius = this.radius * this.radius;
  }

  intersect (ray) {
    const v = ray.origin.subtract(this.center);
    const a0 = v.sqrLength() - this.sqrRadius;
    const DdotV = ray.direction.dot(v);

    if (DdotV <= 0) {
      const discr = DdotV * DdotV - a0;
      if (discr >= 0) {
        const result = new IntersectResult();
        result.geometry = this;
        result.distance = -DdotV - Math.sqrt(discr);
        result.position = ray.getPoint(result.distance);
        result.normal = result.position.subtract(this.center).normalize();
        return result;
      }
    }

    return IntersectResult.noHit;
  }
}
