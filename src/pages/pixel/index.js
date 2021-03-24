import tpl from './view.html';
import { on } from '@/libs/utils';

export default {
  name: 'pixel',
  template: tpl,
  init () {
    this.bindEvent();
  },
  img: null,
  imageName: '',
  bindEvent () {
    on('#file', 'change', this.selectFile.bind(this));
    on('#pixelSizeRange', 'change', this.pixelSizeRange.bind(this))
    on('#pixelBtn', 'click', this.toPixel.bind(this));
    on('#saveBtn', 'click', this.save.bind(this));
  },
  selectFile (event) {
    const image = event.target.files[0];
    this.imageName = image.name;
    const img = new Image();
    img.onload = () => {
      this.img = img;
    }
    img.src = URL.createObjectURL(image);
  },
  toPixel () {
    if (this.img) {
      const size = document.querySelector('#pixelSizeRange').value;
      document.querySelector('#pixelImage').src = this.pixelate(this.img, Number(size))
    }
  },
  pixelate (img, size) {
    const $canvas = document.createElement('canvas');
    const ctx = $canvas.getContext('2d');
    $canvas.width = img.width;
    $canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    for (let x = 0; x < img.width; x += size) {
      for (let y = 0; y < img.height; y += size) {
        let pixels = ctx.getImageData(x, y, size, size);
        let averageRGBA = this.getAverageRGB(pixels.data);
        ctx.fillStyle = averageRGBA;
        ctx.fillRect(x, y, size, size);
      }
    }
    return $canvas.toDataURL()
  },
  getAverageRGB (imgData) {
    let red = 0;
    let green = 0;
    let blue = 0;
    let total = 0;
    for (let i = 0; i < imgData.length; i += 4) {
      if (imgData[i + 3] !== 0) {
        red += imgData[i + 0];
        green += imgData[i + 1];
        blue += imgData[i + 2];
        total++;
      }
    }
    const avgRed = Math.floor(red / total);
    const avgGreen = Math.floor(green / total);
    const avgBlue = Math.floor(blue / total);

    return 'rgba(' + avgRed + ',' + avgGreen + ',' + avgBlue + ', 1)';
  },
  pixelSizeRange (e) {
    const value = e.target.value;
    document.querySelector('#pixelSize').innerText = value;
  },
  save () {
    if (!this.imageName) return;
    const img = document.querySelector('#pixelImage');
    const alink = document.createElement("a");
    alink.setAttribute('download', this.imageName)
    alink.href = img.src;
    alink.click();
  },
  destroy () {
    this.img = null;
    this.imageName = null;
  }
}
