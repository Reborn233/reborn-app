import tpl from '../view.html';
import '../style.less';
import Circle from './circle';

let circle = null;

export default {
  name: 'graphics',
  template: tpl,
  init () {
    circle = new Circle('#canvas', 600, 600);
  },
  destroy () {
    circle = null;
  }
}
