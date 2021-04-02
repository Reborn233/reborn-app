import tpl from '../view.html';
import '../style.less';
import Circle from './circle';

let circle = null;

export default {
  name: 'graphics',
  template: tpl,
  init () {
    circle = new Circle('#canvas');
  },
  destroy () {
    circle = null;
  }
}
