import Vector3 from './Vector3';
import Color from './Color';
const lightDir = new Vector3(1, 1, 1).normalize();
const lightColor = Color.white;
export default class PhongMaterial {
  constructor (diffuse, specular, shininess, reflectiveness) {
    this.diffuse = diffuse;
    this.specular = specular;
    this.shininess = shininess;
    this.reflectiveness = reflectiveness;
  }
  sample (ray, position, normal) {
    const NdotL = normal.dot(lightDir);
    const H = (lightDir.subtract(ray.direction)).normalize();
    const NdotH = normal.dot(H);
    const diffuseTerm = this.diffuse.multiply(Math.max(NdotL, 0));
    const specularTerm = this.specular.multiply(Math.pow(Math.max(NdotH, 0), this.shininess));
    return lightColor.modulate(diffuseTerm.add(specularTerm));
  }
}
