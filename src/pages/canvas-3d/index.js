import tpl from './view.html';
import './style.less';

let canvas, ctx;
let mousedown = false;
let rotationAngle = 30;

export default {
  name: 'canvas3D',
  template: tpl,
  data: {
    visual: {
      x: 0,
      y: 0,
      z: 400
    },
    pointMap: {
      A: [-50, 50, 50],
      B: [-50, 50, -50],
      C: [50, 50, -50],
      D: [50, 50, 50],
      E: [-50, -50, 50],
      F: [-50, -50, -50],
      G: [50, -50, -50],
      H: [50, -50, 50],
    }
  },
  init () {
    canvas = document.querySelector('#canvas');
    ctx = canvas.getContext('2d');
    this.animationFrame();
    let ox, oy, mx, my, mx1;
    canvas.addEventListener('mousedown', (e) => {
      mousedown = true;
      ox = e.offsetX;
      oy = e.offsetY;
    });
    canvas.addEventListener('mousemove', (e) => {
      if (!mousedown) return;
      mx = ox - e.offsetX;
      my = oy - e.offsetY;
      if (mx > mx1) {
        rotationAngle = - mx / 30;
      }
      else {
        rotationAngle = mx / 30;
      }
      mx1 = mx;
      this.animationFrame();
    });
    canvas.addEventListener('mouseup', (e) => {
      mousedown = false;
    });
  },
  animationFrame () {
    for (let key in this.data.pointMap) {
      let point = this.data.pointMap[key]
      let [x, y, z] = point;
      point[0] = x * Math.cos(rotationAngle / 180 * Math.PI) - z * Math.sin(rotationAngle / 180 * Math.PI)
      point[1] = y;
      point[2] = z * Math.cos(rotationAngle / 180 * Math.PI) + x * Math.sin(rotationAngle / 180 * Math.PI)
    }
    this.draw();
  },
  draw () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const { A, B, C, D, E, F, G, H } = this.data.pointMap;
    const points1 = this.drawArea(A, B, C, D)
    const points2 = this.drawArea(E, F, G, H)
    this.drawLine(A, E);
    this.drawLine(B, F);
    this.drawLine(C, G);
    this.drawLine(D, H);
    this.drawPoint(points1, ['A', 'B', 'C', 'D']);
    this.drawPoint(points2, ['E', 'F', 'G', 'H']);
  },
  drawArea (a, b, c, d, color = '#fff') {
    let point;
    let points = [];
    ctx.beginPath();
    point = this.transformPoint(...a);
    ctx.moveTo(point.x, point.y);
    points.push([point.x, point.y]);
    point = this.transformPoint(...b);
    ctx.lineTo(point.x, point.y);
    points.push([point.x, point.y]);
    point = this.transformPoint(...c);
    ctx.lineTo(point.x, point.y);
    points.push([point.x, point.y]);
    point = this.transformPoint(...d);
    ctx.lineTo(point.x, point.y);
    points.push([point.x, point.y]);
    ctx.closePath();
    ctx.strokeStyle = color
    ctx.stroke();
    return points;
  },
  drawPoint (points = [], name = []) {
    points.forEach((point, index) => {
      const [x, y] = point;
      ctx.font = "12px";
      ctx.fillStyle = '#fff';
      ctx.fillText(name[index], x - 10, y + 10);
    })
  },
  drawLine (a, b) {
    let point;
    ctx.beginPath()
    point = this.transformPoint(...a)
    ctx.moveTo(point.x, point.y)
    point = this.transformPoint(...b)
    ctx.lineTo(point.x, point.y)
    ctx.stroke()
    ctx.closePath()
  },
  transformPoint (x, y, z, offsetX = 300, offsetY = 200) {
    const vx = this.data.visual.x;
    const vy = this.data.visual.y;
    const vz = this.data.visual.z;
    return {
      x: (x - vx) * vz / (vz - z) + offsetX,
      y: (y - vy) * vz / (vz - z) + offsetY,
    }
  },
  destroy () {
    canvas = null;
    ctx = null;
  }
}
