import CanvasBase from '../base/canvas-base';
import Sphere from '../base/Sphere';
import Vector3 from '../base/Vector3';
import Camera from '../base/Camera';
import Plane from '../base/Plane';
import CheckerMaterial from '../base/CheckerMaterial';
import PhongMaterial from '../base/PhongMaterial';
import Color from '../base/Color';
import Union from '../base/Union';
import Ray from '../base/Ray';
import LightSample from '../base/LightSample';
import DirectionalLight from '../base/DirectionalLight';
import PointLight from '../base/PointLight';
import SpotLight from '../base/SpotLight';
export default class Circle extends CanvasBase {
  constructor (id, width, height) {
    super(id, width, height);
    this.draw();
  }
  draw () {
    const canvas = this.canvas;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const plane = new Plane(new Vector3(0, 1, 0), 0);
    const sphere2 = new Sphere(new Vector3(10, 5, -10), 5);
    const sphere1 = new Sphere(new Vector3(-10, 10, -10), 10);
    plane.material = new CheckerMaterial(.1, .25);
    sphere2.material = new PhongMaterial(Color.orangle, Color.white, 16, .25);
    sphere1.material = new PhongMaterial(Color.yellow, Color.white, 16, .25);
    // this.rayTraceReflection(
    //   new Union([plane, sphere1, sphere2]),
    //   new Camera(
    //     new Vector3(0, 5, 15),
    //     new Vector3(0, 0, -1),
    //     new Vector3(0, 1, 0),
    //     120
    //   ),
    //   3
    // )
    let lights = [];
    for (let x = 10; x <= 30; x += 4)
      for (let z = 20; z <= 40; z += 4)
        lights.push(new PointLight(Color.white.multiply(80), new Vector3(x, 50, z)));
    //
    let fillLight = new DirectionalLight(Color.white.multiply(0.25), new Vector3(1.5, 1, 0.5));
    fillLight.shadow = false;
    lights.push(fillLight);
    this.renderLight(
      new Union([
        new Plane(new Vector3(0, 1, 0), 0),
        new Plane(new Vector3(0, 0, 1), -50),
        new Plane(new Vector3(1, 0, 0), -20),
        new Sphere(new Vector3(0, 10, -10), 10)
      ]),
      lights,
      new Camera(new Vector3(0, 10, 10), new Vector3(0, 0, -1), new Vector3(0, 1, 0), 90)
    )
  }

  renderDepth (scene, camera, maxDepth) {
    scene.initialize();
    camera.initialize();
    const canvas = this.canvas;
    const ctx = this.ctx;
    const w = canvas.width;
    const h = canvas.height;
    const imgdata = ctx.getImageData(0, 0, w, h);
    const pixels = imgdata.data;
    let i = 0;
    for (let y = 0; y < h; y++) {
      let sy = 1 - y / h;
      for (let x = 0; x < w; x++) {
        let sx = x / w;
        let ray = camera.generateRay(sx, sy);
        let result = scene.intersect(ray);
        if (result.geometry) {
          let depth = 255 - Math.min((result.distance / maxDepth) * 255, 255);
          pixels[i] = depth;
          pixels[i + 1] = depth;
          pixels[i + 2] = depth;
          pixels[i + 3] = 255;
        }
        i += 4;
      }
    }

    ctx.putImageData(imgdata, 0, 0);
  }

  rayTrace (scene, camera) {
    scene.initialize();
    camera.initialize();
    const canvas = this.canvas;
    const ctx = this.ctx;
    const w = canvas.width;
    const h = canvas.height;
    const imgdata = ctx.getImageData(0, 0, w, h);
    const pixels = imgdata.data;
    let i = 0;
    for (let y = 0; y < h; y++) {
      let sy = 1 - y / h;
      for (let x = 0; x < w; x++) {
        let sx = x / w;
        let ray = camera.generateRay(sx, sy);
        let result = scene.intersect(ray);
        if (result.geometry) {
          let color = result.geometry.material.sample(ray, result.position, result.normal);
          pixels[i] = color.r * 255;
          pixels[i + 1] = color.g * 255;
          pixels[i + 2] = color.b * 255;
          pixels[i + 3] = 255;
        }
        i += 4;
      }
    }

    ctx.putImageData(imgdata, 0, 0);
  }

  rayTraceReflection (scene, camera, maxReflect) {
    const canvas = this.canvas;
    const ctx = this.ctx;
    const w = canvas.width;
    const h = canvas.height;
    const imgdata = ctx.getImageData(0, 0, w, h);
    const pixels = imgdata.data;
    scene.initialize();
    camera.initialize();
    let i = 0;
    for (let y = 0; y < h; y++) {
      let sy = 1 - y / h;
      for (let x = 0; x < w; x++) {
        let sx = x / w;
        let ray = camera.generateRay(sx, sy);
        const color = this.rayTraceRecursive(scene, ray, maxReflect);
        pixels[i++] = color.r * 255;
        pixels[i++] = color.g * 255;
        pixels[i++] = color.b * 255;
        pixels[i++] = 255;
      }
    }

    ctx.putImageData(imgdata, 0, 0);
  }

  rayTraceRecursive (scene, ray, maxReflect) {
    const result = scene.intersect(ray);

    if (result.geometry) {
      const reflectiveness = result.geometry.material.reflectiveness;
      let color = result.geometry.material.sample(ray, result.position, result.normal);
      color = color.multiply(1 - reflectiveness);

      if (reflectiveness > 0 && maxReflect > 0) {
        const r = result.normal.multiply(-2 * result.normal.dot(ray.direction)).add(ray.direction);
        ray = new Ray(result.position, r);
        const reflectedColor = this.rayTraceRecursive(scene, ray, maxReflect - 1);
        color = color.add(reflectedColor.multiply(reflectiveness));
      }
      return color;
    }
    else
      return Color.black;
  }
  renderLight (scene, lights, camera) {
    const canvas = this.canvas;
    const ctx = this.ctx;
    const w = canvas.width;
    const h = canvas.height;
    const imgdata = ctx.getImageData(0, 0, w, h);
    const pixels = imgdata.data;
    scene.initialize();
    for (let k in lights) {
      lights[k].initialize();
    }
    camera.initialize();
    let i = 0;
    for (let y = 0; y < h; y++) {
      let sy = 1 - y / h;
      for (let x = 0; x < w; x++) {
        let sx = x / w;
        let ray = camera.generateRay(sx, sy);
        let result = scene.intersect(ray);
        if (result.geometry) {
          let color = Color.black;
          for (let k in lights) {
            const lightSample = lights[k].sample(scene, result.position);
            if (lightSample !== LightSample.zero) {
              let NdotL = result.normal.dot(lightSample.L);
              if (NdotL >= 0) {
                color = color.add(lightSample.EL.multiply(NdotL));
              }
            }
          }
          pixels[i] = color.r * 255;
          pixels[i + 1] = color.g * 255;
          pixels[i + 2] = color.b * 255;
          pixels[i + 3] = 255;
        }
        i += 4
      }
    }

    ctx.putImageData(imgdata, 0, 0);
  }
}
