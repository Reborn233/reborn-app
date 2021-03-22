import tpl from './view.html';
import './style.less';
const func = {
  name: 'function',
  template: tpl,
  init () {
    func.bindEvent();
  },
  bindEvent () {
    // on('#menus', 'click', (ev) => {
    //   const target = event.target;
    //   const clickEl = target.closest('.card');
    //   if (clickEl) {
    //     const url = clickEl.dataset.url;
    //     log(url)
    //     return;
    //   }
    // })
  }
}

export default func
