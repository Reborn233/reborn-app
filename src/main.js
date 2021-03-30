import './style.less';
import pageManager from './libs/page-manager';
import Home from './pages/home';
import About from './pages/about';
import Func from './pages/function';
import Qrcode from './pages/qrcode';
import ImageToBase64 from './pages/imageToBase64';
import Pixel from './pages/pixel';
import Kcal from './pages/kcal';
import Face from './pages/face';

function setPageManager () {
  const pages = {
    home: Home,
    function: Func,
    about: About,
    qrcode: Qrcode,
    imageToBase64: ImageToBase64,
    pixel: Pixel,
    kcal: Kcal,
    face: Face
  }
  pages.home.url = '#';

  for (let page in pages) {
    pages[page].url = `#${pages[page].name}`
    pageManager.push(pages[page]);
  }
  pageManager.setDefault('home').init();
}

function updateApp () {
  const $update = document.querySelector('#update');
  $update.addEventListener('click', () => {
    window.location.reload(true);
  });
}

function _init_ () {
  updateApp();
  window.log = console.log.bind(console);
  window.Toast = (content = '提示', timeout = 4000) => mdui.snackbar({
    message: content,
    position: 'top',
    timeout: timeout
  });
  window.$$ = mdui.$;
  setPageManager();
  window.pageManager = pageManager;
  window.home = function () {
    this.location.hash = ''
  }
}

window.onload = _init_;
