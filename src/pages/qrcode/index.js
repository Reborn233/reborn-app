import './style.less';
import tpl from './view.html';
import { on } from '@/libs/utils';
import alert from '@/libs/alert';
import QRCode from 'qrcodejs2'
const qrcode = {
  name: 'qrcode',
  template: tpl,
  init () {
    qrcode.bindEvent();
  },
  bindEvent () {
    on('#toQrcodeBtn', 'click', qrcode.toQrcode)

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
      alert('请输入内容!');
    }
  }
}
export default qrcode
