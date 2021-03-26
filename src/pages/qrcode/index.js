import './style.less';
import tpl from './view.html';
import { on } from '@/libs/utils';
import QRCode from 'qrcodejs2';

export default {
  name: 'qrcode',
  template: tpl,
  init () {
    mdui.mutation();
    this.bindEvent();
  },
  bindEvent () {
    on('#toQrcodeBtn', 'click', this.toQrcode.bind(this))

  },
  toQrcode (ev) {
    const $text = document.querySelector('#textarea');
    const $qrcode = document.querySelector('#qrcode');
    const value = $text.value;
    if (this.valid(value)) {
      $qrcode.innerHTML = '';
      const qrcode = new QRCode("qrcode", {
        text: value,
        width: 256,
        height: 256,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
    }
  },
  valid (value) {
    const $text = document.querySelector('#textarea');
    if (value) {
      $text.parentNode.classList.remove('mdui-textfield-invalid');
      return true;
    }
    else {
      $text.parentNode.classList.add('mdui-textfield-invalid');
      return false;
    }
  }
}
