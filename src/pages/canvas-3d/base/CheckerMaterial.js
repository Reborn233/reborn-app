import Color from "./Color";

export default class CheckerMaterial {
  constructor (scale, reflectiveness) {
    this.scale = scale;
    this.reflectiveness = reflectiveness;
  }

  sample (ray, position, normal) {
    return Math.abs((Math.floor(position.x * 0.1) + Math.floor(position.z * this.scale)) % 2) < 1 ? Color.black : Color.white;
  }
}
