import tpl from '../view.html';
import '../style.less';
import Square from './square';

let square = null;

export default {
  name: 'cube',
  template: tpl,
  init () {
    square = new Square('#canvas', 600, 400);
    $$('.page').append(`<h1>鼠标按住可旋转立方体</h1>`)
  },
  destroy () {
    square = null;
  }
}
