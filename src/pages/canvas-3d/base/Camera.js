import Ray from './Ray'
export default class Camera {
  constructor (eye, front, up, fov) {
    this.eye = eye;
    this.front = front;
    this.refUp = up;
    this.fov = fov;
  }

  initialize () {
    this.right = this.front.cross(this.refUp);
    this.up = this.right.cross(this.front);
    this.fovScale = Math.tan(this.fov * 0.5 * Math.PI / 180) * 2;
  }

  generateRay (x, y) {
    const r = this.right.multiply((x - 0.5) * this.fovScale);
    const u = this.up.multiply((y - 0.5) * this.fovScale);
    return new Ray(this.eye, this.front.add(r).add(u).normalize());
  }
}
