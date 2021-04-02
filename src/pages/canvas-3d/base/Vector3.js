export default class Vector3 {
  constructor (x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  static zero = new Vector3(0, 0, 0);

  copy () {
    return new Vector3(this.x, this.y, this.z)
  }

  length () {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2)
  }

  sqrLength () {
    return this.x ** 2 + this.y ** 2 + this.z ** 2
  }

  normalize () {
    const inv = 1 / this.length();
    return new Vector3(this.x * inv, this.y * inv, this.z * inv)
  }

  negate () {
    return new Vector3(-this.x, -this.y, -this.z);
  }

  add (v) {
    return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  subtract (v) {
    return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  multiply (f) {
    return new Vector3(this.x * f, this.y * f, this.z * f);
  }

  divide (f) {
    const invf = 1 / f;
    return new Vector3(this.x * invf, this.y * invf, this.z * invf);
  }

  dot (v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  cross (v) {
    return new Vector3(-this.z * v.y + this.y * v.z, this.z * v.x - this.x * v.z, -this.y * v.x + this.x * v.y);
  }

}
