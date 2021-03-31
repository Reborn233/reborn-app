import tpl from './view.html';
import './style.less';
import { isPC, on, findMaxKeyFromJson } from '@/libs/utils';

const ZN = {
  angry: '生气',
  disgusted: '厌恶',
  fearful: '忧愁',
  happy: '开心',
  neutral: '普通',
  sad: '伤心',
  surprised: '惊讶'
}
function getUserMedia (constrains, success, error) {
  if (navigator.mediaDevices.getUserMedia) {
    //最新标准API
    navigator.mediaDevices.getUserMedia(constrains).then(success).catch(error);
  }
  else if (navigator.webkitGetUserMedia) {
    //webkit内核浏览器
    navigator.webkitGetUserMedia(constrains).then(success).catch(error);
  }
  else if (navigator.mozGetUserMedia) {
    //Firefox浏览器
    navagator.mozGetUserMedia(constrains).then(success).catch(error);
  }
  else if (navigator.getUserMedia) {
    //旧版API
    navigator.getUserMedia(constrains).then(success).catch(error);
  }
}

let timer = null;
let mediaStreamTrack = null;

export default {
  name: 'face',
  template: tpl,
  init () {
    this.initVideo();
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('./public/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('./public/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('./public/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('./public/models'),
    ]).then(this.run.bind(this))
  },
  initVideo () {
    const w = document.body.clientWidth;
    const h = document.body.clientHeight;
    const headerH = $$('header').height();
    const video = $$('#video');
    if (isPC()) {
      video.attr('width', w - 240);
      video.attr('height', h - headerH - 50);
    }
    else {
      video.attr('width', w);
      video.attr('height', h - headerH - 50);
    }
  },
  run () {
    const video = document.querySelector('#video');
    const faceBtn = document.querySelector('#faceBtn');

    video.onloadedmetadata = () => {
      faceBtn.disabled = false;
      video.play();
    };
    on('#video', 'play', this.facePlay);
    on('#faceBtn', 'click', this.openMedia);
    on('#closeBtn', 'click', this.closeMedia)
  },
  facePlay () {
    const canvas = faceapi.createCanvasFromMedia(video);
    const $face = document.querySelector('.video-box');
    $face.append(canvas);
    const displaySize = { width: video.clientWidth, height: video.clientHeight };
    faceapi.matchDimensions(canvas, displaySize);
    timer = setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      // faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
      resizedDetections.forEach(res => {
        const { x, y, height } = res.detection.box;
        const exp = findMaxKeyFromJson(res.expressions);
        const text = new faceapi.draw.DrawTextField(
          ZN[exp.key],
          {
            x: x,
            y: y + height,
          },
          {
            fontColor: '#fff',
            fontSize: 28
          }
        );
        text.draw(canvas);
      })
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    }, 100);
  },
  openMedia () {
    const video = document.querySelector('#video');
    const faceBtn = document.querySelector('#faceBtn');
    faceBtn.disabled = true;
    getUserMedia({ video: true }, (stream) => {
      if ('srcObject' in video) {
        video.srcObject = stream;
      }
      else {
        video.src = window.URL.createObjectURL(stream);
      }
      mediaStreamTrack = stream;
    }, (err) => {
      Toast(err.name)
    });
  },
  closeMedia () {
    if (mediaStreamTrack) {
      const tracks = mediaStreamTrack.getTracks();
      tracks.forEach(track => {
        track.stop();
      });
      mediaStreamTrack = null;
    }
    clearInterval(timer);
    timer = null;
  },
  destroy () {
    this.closeMedia();
  }
}
