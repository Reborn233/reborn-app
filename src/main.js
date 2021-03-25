import './style.less';
import pageManager from './libs/page-manager';
import Alert from './libs/alert';
import Home from './pages/home';
import About from './pages/about';
import Func from './pages/function';
import Qrcode from './pages/qrcode';
import ImageToBase64 from './pages/imageToBase64';
import Pixel from './pages/pixel';
import Kcal from './pages/kcal';

function setPageManager () {
  const pages = {
    home: Home,
    function: Func,
    about: About,
    qrcode: Qrcode,
    imageToBase64: ImageToBase64,
    pixel: Pixel,
    kcal: Kcal
  }
  pages.home.url = '#';

  for (let page in pages) {
    pages[page].url = `#${pages[page].name}`
    pageManager.push(pages[page]);
  }
  pageManager.setDefault('home').init();
}

function hideSplashscreen () {
  const splashscreen = document.querySelector('#splashscreen');
  if (window.innerWidth >= 576) {
    document.body.removeChild(splashscreen);
    return;
  }
  splashscreen.querySelector('.button').addEventListener('click', () => {
    splashscreen.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(splashscreen);
    }, 300)
  })
}

function initBurger () {
  const $burger = document.querySelector('#burger');
  const $appNav = document.querySelector('.app-nav');
  const $model = document.querySelector('.app-nav + .app-modal-backdrop');
  $burger.addEventListener('click', () => {
    $burger.classList.toggle('active');
    $appNav.classList.toggle('active');
  })
  $appNav.addEventListener('click', (e) => {
    const target = e.target;
    const link = target.closest('.nav-link');
    if (link) {
      $burger.classList.remove('active');
      $appNav.classList.remove('active');
    }
  });
  $model.addEventListener('click', (e) => {
    $burger.classList.remove('active');
    $appNav.classList.remove('active');
  })
}

function updateApp () {
  const $update = document.querySelector('#update');
  $update.addEventListener('click', () => {
    window.location.reload(true);
  });
}

function initBoot () {
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  });
}

function _init_ () {
  updateApp();
  initBurger();
  setPageManager();
  window.log = console.log.bind(console);
  window.pageManager = pageManager;
  window.Alert = Alert;
  window.home = function () {
    this.location.hash = ''
  }
  initBoot();
  hideSplashscreen();

}

window.onload = _init_;
