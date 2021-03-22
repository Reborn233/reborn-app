import './style.less';
import tpl from './view.html';
import { on } from '@/libs/utils';
import QRCode from 'qrcodejs2';

export default {
  name: 'qrcode',
  template: tpl,
  init () {
    this.bindEvent();
  },
  bindEvent () {
    on('#toQrcodeBtn', 'click', this.toQrcode)

  },
  toQrcode (ev) {
    const $text = document.querySelector('#textarea');
    const $qrcode = document.querySelector('#qrcode');
    const value = $text.value;
    if (value) {
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
    else {
      Alert('请输入内容!');
    }
  }
}
