import './style.less';
import tpl from './view.html';
import funcList from './func-list.html';
import { template } from '@/libs/utils';

export default {
  name: 'function',
  template: tpl,
  data: {
    lists: [
      {
        name: '转二维码',
        url: '#qrcode',
        icon: require('@/assets/images/qrcode.png')
      },
      {
        name: '图片转base64',
        url: '#imageToBase64',
        icon: require('@/assets/images/imageToBase64.png')
      }
    ]
  },
  init () {
    this.renderList();
  },
  renderList () {
    const $list = template(funcList, { data: this.data.lists });
    document.querySelector('#function').innerHTML = $list;
  }
}
