import Ray from "./Ray";
import LightSample from "./LightSample";

export default class DirectionalLight {
  constructor (irradiance, direction) {
    this.irradiance = irradiance;
    this.direction = direction;
    this.shadow = true;
  }

  initialize () {
    this.L = this.direction.normalize().negate();
  }

  sample (scene, position) {
    if (this.shadow) {
      let shadowRay = new Ray(position, this.L);
      let shadowResult = scene.intersect(shadowRay);
      if (shadowResult.geometry)
        return LightSample.zero;
    }

    return new LightSample(this.L, this.irradiance);
  }
}
