export default class CanvasBase {
  constructor (id) {
    this.canvas = document.querySelector(id);
    this.ctx = this.canvas.getContext('2d');
  }
}
