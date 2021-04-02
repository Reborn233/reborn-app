export default class CanvasBase {
  constructor (id, width = 500, height = 500) {
    this.canvas = document.querySelector(id);
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d');
  }
}
