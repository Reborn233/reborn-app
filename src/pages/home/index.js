import tpl from './view.html';
import './style.less';
// 日期时间补零
function padLeftZero (str) {
  return ('00' + str).substr(str.length);
}

function formatDate (date, dateFormat) {
  if (/(y+)/.test(dateFormat)) {
    dateFormat = dateFormat.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'm+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'i+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(dateFormat)) {
      // 取出对应的值       
      let str = o[k] + '';
      dateFormat = dateFormat.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  } return dateFormat;
}

class Flipper {
  constructor (config = {}) {
    this.config = {
      node: null,
      frontText: 'number0',
      backText: 'number1',
      duration: 600
    }

    this.nodeClass = {
      flip: 'flip',
      front: 'digital front',
      back: 'digital back'
    }
    Object.assign(this.config, config);
    this.frontNode = this.config.node.querySelector('.front')
    this.backNode = this.config.node.querySelector('.back')
    this.isFlipping = false
    this._init()
  }
  _init () {
    this._setFront(this.config.frontText)
    this._setBack(this.config.backText)
  }
  _setFront (className) {
    this.frontNode.setAttribute('class', this.nodeClass.front + ' ' + className)
  }
  _setBack (className) {
    this.backNode.setAttribute('class', this.nodeClass.back + ' ' + className)
  }
  _flip (type, front, back) {
    if (this.isFlipping) { return false }
    this.isFlipping = true
    this._setFront(front)
    this._setBack(back)
    let flipClass = this.nodeClass.flip;
    if (type === 'down') {
      flipClass += ' down'
    }
    else {
      flipClass += ' up'
    }
    this.config.node.setAttribute('class', flipClass + ' go')
    setTimeout(() => {
      this.config.node.setAttribute('class', flipClass)
      this.isFlipping = false
      this._setFront(back)
    }, this.config.duration)
  }

  flipDown (fronts, back) {
    this._flip('down', fronts, back)
  }

  flipUp (fronts, back) {
    this._flip('up', fronts, back)
  }
}

let timer = null;

export default {
  name: 'home',
  template: tpl,
  init () {
    const clock = document.querySelector('#clock');
    const flips = clock.querySelectorAll('.flip');
    const now = new Date();
    let nowTimeStr = formatDate(now, 'hhiiss');
    let nextTimeStr = formatDate(new Date(now.getTime() + 1000), 'hhiiss');
    let flipObjs = [];
    for (let i = 0; i < flips.length; i++) {
      flipObjs.push(new Flipper({
        node: flips[i],
        frontText: 'number' + nowTimeStr[i],
        backText: 'number' + nextTimeStr[i]
      }))
    }
    timer = setInterval(() => {
      let now = new Date()
      let nowTimeStr = formatDate(new Date(now.getTime() - 1000), 'hhiiss')
      let nextTimeStr = formatDate(now, 'hhiiss')
      for (let i = 0; i < flipObjs.length; i++) {
        if (nowTimeStr[i] === nextTimeStr[i]) { continue }
        flipObjs[i].flipDown('number' + nowTimeStr[i], 'number' + nextTimeStr[i])
      }
    }, 1000);
  },
  destroy () {
    window.clearInterval(timer);
    timer = null;
  }
}
