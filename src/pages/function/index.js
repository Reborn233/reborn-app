import './style.less';
import tpl from './view.html';
import funcList from './func-list.html';
import { template } from '@/libs/utils';
import { menus } from '@/config';

export default {
  name: 'function',
  template: tpl,
  data: {
    lists: menus
  },
  init () {
    this.renderList();
  },
  renderList () {
    const $list = template(funcList, { data: this.data.lists });
    document.querySelector('#function').innerHTML = $list;
  }
}
