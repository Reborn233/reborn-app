import LightSample from "./LightSample";
import Ray from "./Ray";

export default class SpotLight {
  constructor (intensity, position, direction, theta, phi, falloff) {
    this.intensity = intensity;
    this.position = position;
    this.direction = direction;
    this.theta = theta;
    this.phi = phi;
    this.falloff = falloff;
    this.shadow = true;
  }

  initialize () {
    this.S = this.direction.normalize().negate();
    this.cosTheta = Math.cos(this.theta * Math.PI / 180 / 2);
    this.cosPhi = Math.cos(this.phi * Math.PI / 180 / 2);
    this.baseMultiplier = 1 / (this.cosTheta - this.cosPhi);
  }

  sample (scene, position) {
    // 计算L，但保留r和r^2，供之后使用
    let delta = this.position.subtract(position);
    let rr = delta.sqrLength();
    let r = Math.sqrt(rr);
    let L = delta.divide(r);

    // 计算聚光灯因子
    let spot;
    let SdotL = this.S.dot(L);
    if (SdotL >= this.cosTheta)
      spot = 1;
    else if (SdotL <= this.cosPhi)
      spot = 0;
    else
      spot = Math.pow((SdotL - this.cosPhi) * this.baseMultiplier, this.falloff);

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
    return new LightSample(L, this.intensity.multiply(attenuation * spot));
  }
}
