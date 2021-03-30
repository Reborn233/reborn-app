import tpl from './view.html';
import './style.less';

const ZN = {
  angry: '生气',
  disgusted: '厌恶',
  fearful: '忧愁',
  happy: '开心',
  neutral: '普通',
  sad: '伤心',
  surprised: '惊讶'
}

export default {
  name: 'face',
  template: tpl,
  init () {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('../../../public/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('../../../public/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('../../../public/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('../../../public/models'),
    ]).then(this.run.bind(this))
  },
  run () {
    const _this = this;
    const video = document.querySelector('#video');
    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        {
          video: true
        },
        (stream) => {
          video.srcObject = stream
        },
        (err) => {
          Toast(err.name)
        }
      );
    }
    video.addEventListener('play', () => {
      const canvas = faceapi.createCanvasFromMedia(video);
      const $face = document.querySelector('.face');
      $face.append(canvas);
      const displaySize = { width: video.width, height: video.height };
      faceapi.matchDimensions(canvas, displaySize);
      setInterval(async () => {
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        // faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
        detections.forEach(res => {
          const { x, y, height, width } = res.alignedRect.box;
          const exp = _this.max(res.expressions);
          const text = new faceapi.draw.DrawTextField(
            ZN[exp.key],
            {
              x: x - width / 2,
              y: y + height / 2
            },
            {
              fontColor: '#fff'
            }
          );
          text.draw(canvas);
        })
      }, 100);
    });
  },
  max (data) {
    let a = 0;
    let k = null;
    for (let key in data) {
      const num = data[key];
      if (!Number.isNaN(num)) {
        k = num > a ? key : k;
        a = num > a ? num : a;
      }
    }
    return k ? { key: k, value: a } : null
  }
}
