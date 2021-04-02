import CanvasBase from './base/canvas-base';
export default class Square extends CanvasBase {
  constructor (...args) {
    super(args);
    this.visual = {
      x: 0,
      y: 0,
      z: 400
    }
    this.pointMap = {
      A: [-50, 50, 50],
      B: [-50, 50, -50],
      C: [50, 50, -50],
      D: [50, 50, 50],
      E: [-50, -50, 50],
      F: [-50, -50, -50],
      G: [50, -50, -50],
      H: [50, -50, 50],
    }
    this.ox = 0;
    this.oy = 0;
    this.mx = 0;
    this.my = 0;
    this.mousedown = false;
    this.rotationAngleY = 30;
    this.rotationAngleX = 0;
    this.bindEvent();
  }
  bindEvent () {
    const canvas = this.canvas;
    canvas.addEventListener('mousedown', (e) => {
      this.mousedown = true;
      this.ox = e.offsetX / 2;
      this.oy = e.offsetY / 2;
    });
    canvas.addEventListener('mousemove', (e) => {
      if (!this.mousedown) return;
      this.mx = e.offsetX / 2 - this.ox;
      this.my = e.offsetY / 2 - this.oy;
      this.rotationAngleY = -this.mx;
      this.rotationAngleX = -this.my;
      this.drawSquare();
      this.ox = e.offsetX / 2;
      this.oy = e.offsetY / 2;
    });
    canvas.addEventListener('mouseup', (e) => {
      this.mousedown = false;
    });
    this.drawSquare();
  }

  drawSquare () {
    const rotationAngleY = this.rotationAngleY;
    const rotationAngleX = this.rotationAngleX;
    for (let key in this.pointMap) {
      let point = this.pointMap[key]
      let [x, y, z] = point;
      // 绕Y轴旋转
      point[0] = x * Math.cos(rotationAngleY / 180 * Math.PI) - z * Math.sin(rotationAngleY / 180 * Math.PI)
      point[1] = y;
      point[2] = z * Math.cos(rotationAngleY / 180 * Math.PI) + x * Math.sin(rotationAngleY / 180 * Math.PI)
      // 绕X轴旋转
      let [x1, y1, z1] = point;
      point[0] = x1;
      point[1] = y1 * Math.cos(rotationAngleX / 180 * Math.PI) - z1 * Math.sin(rotationAngleX / 180 * Math.PI);
      point[2] = z1 * Math.cos(rotationAngleX / 180 * Math.PI) + y1 * Math.sin(rotationAngleX / 180 * Math.PI)
    }
    this.draw();
  }
  draw () {
    const canvas = this.canvas;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const { A, B, C, D, E, F, G, H } = this.pointMap;
    const points1 = this.drawArea(A, B, C, D)
    const points2 = this.drawArea(E, F, G, H)
    this.drawLine(A, E);
    this.drawLine(B, F);
    this.drawLine(C, G);
    this.drawLine(D, H);
    this.drawPoint(points1, ['A', 'B', 'C', 'D']);
    this.drawPoint(points2, ['E', 'F', 'G', 'H']);
  }
  drawArea (a, b, c, d, color = '#fff') {
    const ctx = this.ctx;
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
  }
  drawPoint (points = [], name = []) {
    const ctx = this.ctx;
    points.forEach((point, index) => {
      const [x, y] = point;
      ctx.font = "12px";
      ctx.fillStyle = '#fff';
      ctx.fillText(name[index], x - 10, y + 10);
    })
  }
  drawLine (a, b) {
    const ctx = this.ctx;
    let point;
    ctx.beginPath()
    point = this.transformPoint(...a)
    ctx.moveTo(point.x, point.y)
    point = this.transformPoint(...b)
    ctx.lineTo(point.x, point.y)
    ctx.stroke()
    ctx.closePath()
  }
  transformPoint (x, y, z, offsetX = 300, offsetY = 200) {
    const vx = this.visual.x;
    const vy = this.visual.y;
    const vz = this.visual.z;
    return {
      x: (x - vx) * vz / (vz - z) + offsetX,
      y: (y - vy) * vz / (vz - z) + offsetY,
    }
  }
}
