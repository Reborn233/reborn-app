import CanvasBase from './base/canvas-base';
import Sphere from './base/Sphere';
import Vector3 from './base/Vector3';
import Camera from './base/Camera';
export default class Circle extends CanvasBase {
  constructor (...args) {
    super(args);
    this.draw();
  }
  draw () {
    const canvas = this.canvas;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const sphere = new Sphere(new Vector3(0, 10, -10), 10);
    const camera = new Camera(new Vector3(0, 10, 10), new Vector3(0, 0, -1), new Vector3(0, 1, 0), 90);

    this.renderDepth(sphere, camera, 20)
  }

  renderDepth (scene, camera, maxDepth) {
    const canvas = this.canvas;
    const ctx = this.ctx;
    const w = canvas.width;
    const h = canvas.height;
    scene.initialize();
    camera.initialize();
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
}
