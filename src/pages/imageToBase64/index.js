import tpl from './view.html';
import { on } from '@/libs/utils';
import ClipboardJS from 'clipboard';
let clipboard;

export default {
  name: 'imageToBase64',
  template: tpl,
  init () {
    this.bindEvent();
  },
  bindEvent () {
    on('#fileBtn', 'click', () => {
      document.querySelector('#file').click();
    })
    on('#file', 'change', this.selectFile.bind(this));
    clipboard = new ClipboardJS('#copyBtn');
    clipboard.on('success', (e) => {
      Toast('已拷贝到剪切板');
      e.clearSelection();
    });
  },
  selectFile (event) {
    const image = event.target.files[0];
    document.querySelector('#fileName').innerText = image.name;
    const url = window.URL || window.webkitURL
    const img = new Image();
    img.onload = () => {
      document.querySelector('#base64').value = this.toBase64(img, image.type)
    }
    img.src = url.createObjectURL(image);
  },
  toBase64 (img, type = 'image/png') {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);
    const dataURL = canvas.toDataURL(type);
    return dataURL;
  },
  destroy () {
    clipboard.destroy();
  }
}
