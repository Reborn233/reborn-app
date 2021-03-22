import './style.less';
import pageManager from './libs/page-manager';
import Home from './pages/home';
import About from './pages/about';
import Function from './pages/function';
import Qrcode from './pages/qrcode';
function createPage (page) {
  return {
    name: page.name,
    url: '#' + page.name,
    template: page.template,
    init: page.init,
    destory: page.destory
  }
}

function setPageManager () {
  const pages = {
    home: createPage(Home),
    function: createPage(Function),
    about: createPage(About),
    qrcode: createPage(Qrcode)
  }
  pages.home.url = '#';

  for (let page in pages) {
    pageManager.push(pages[page]);
  }
  pageManager.setDefault('home').init();
}

function hideSplashscreen () {
  const splashscreen = document.querySelector('#splashscreen');
  splashscreen.style.opacity = '0';
  setTimeout(() => {
    document.body.removeChild(splashscreen);
  }, 300)
}

function _init_ () {
  setPageManager();
  window.log = console.log.bind(console);
  window.pageManager = pageManager;
  window.home = function () {
    this.location.hash = ''
  }
  hideSplashscreen();
}

window.onload = _init_;
