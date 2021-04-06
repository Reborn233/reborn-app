import Vector3 from "./Vector3";
import Color from "./Color";

export default class LightSample {
  constructor (L, EL) {
    this.L = L;
    this.EL = EL;
  }
  static zero = new LightSample(Vector3.zero, Color.black)
}
