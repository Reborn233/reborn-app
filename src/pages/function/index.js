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
      },
      {
        name: '像素化图片',
        url: '#pixel',
        icon: require('@/assets/images/pixel.png')
      },
      {
        name: '减肥热量计算器(傻瓜版)',
        url: '#kcal',
        icon: require('@/assets/images/pixel.png')
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
