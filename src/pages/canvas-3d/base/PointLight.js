import LightSample from "./LightSample";
import Ray from "./Ray";

export default class PointLight {
  constructor (intensity, position) {
    this.intensity = intensity;
    this.position = position;
    this.shadow = true;
  }

  initialize () {

  }

  sample (scene, position) {
    // 计算L，但保留r和r^2，供之后使用
    let delta = this.position.subtract(position);
    let rr = delta.sqrLength();
    let r = Math.sqrt(rr);
    let L = delta.divide(r);

    // 阴影测试
    if (this.shadow) {
      let shadowRay = new Ray(position, L);
      let shadowResult = scene.intersect(shadowRay);
      // 在r以内的相交点才会遮蔽光源
      if (shadowResult.geometry && shadowResult.distance <= r)
        return LightSample.zero;
    }

    // 平方反比衰减
    let attenuation = 1 / rr;

    // 计算幅照度
    return new LightSample(L, this.intensity.multiply(attenuation));
  }
}
