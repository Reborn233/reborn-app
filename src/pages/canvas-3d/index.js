import tpl from './view.html';
import './style.less';
import Square from './square';
import Circle from './circle';

let square = null;
let circle = null;

export default {
  name: 'canvas3D',
  template: tpl,
  init () {
    square = new Square('#canvas');
    // 
    circle = new Circle('#circle')
  },
  destroy () {
    square = null;
  }
}
