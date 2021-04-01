import { getUrlParams } from '@/libs/utils';
import { fineMenusName } from '@/config';
const pageManager = {
  $container: document.querySelector('#container'),
  _pageStack: [],
  _configs: [],
  _pageAppend: function () { },
  _defaultPage: null,
  _pageIndex: 1,
  setDefault: function (defaultPage) {
    this._defaultPage = this._find('name', defaultPage);
    return this;
  },
  setPageAppend: function (pageAppend) {
    this._pageAppend = pageAppend;
    return this;
  },
  init: function () {
    const self = this;
    window.addEventListener('hashchange', function () {
      const state = history.state || {};
      const url = location.hash.indexOf('#') === 0 ? location.hash : '#';
      const page = self._find('url', url) || self._defaultPage;
      const prevPage = self._pageStack[self._pageStack.length - 1];
      if (prevPage) {
        prevPage.config.destroy && prevPage.config.destroy();
      }

      if (state._pageIndex <= self._pageIndex || self._findInStack(url)) {
        self._back(page);
      }
      else {
        self._go(page);
      }
      self.setNavbarActive(page);
    });

    if (history.state && history.state._pageIndex) {
      this._pageIndex = history.state._pageIndex;
    }

    this._pageIndex--;

    const url = location.hash.indexOf('#') === 0 ? location.hash : '#';
    const page = self._find('url', url) || self._defaultPage;
    this._go(page);
    self.setNavbarActive(page);
    return this;
  },
  push: function (config) {
    this._configs.push(config);
    return this;
  },
  go: function (to) {
    const config = this._find('name', to);
    if (!config) {
      return;
    }
    location.hash = config.url;
  },
  _go: function (config) {
    this._pageIndex++;

    history.replaceState && history.replaceState({ _pageIndex: this._pageIndex }, '', location.href);

    const html = config.template;
    this.render(html);
    this._pageAppend.call(this, html);
    this._pageStack.push({
      config: config,
      dom: html
    });

    // if (!config.isBind) {
    //   this._bind(config);
    // }
    if (config.init) {
      const params = getUrlParams();
      config.init(params);
    }
    return this;
  },
  back: function () {
    history.back();
  },
  _back: function (config) {
    this._pageIndex--;

    const stack = this._pageStack.pop();
    if (!stack) {
      return;
    }

    const url = location.hash.indexOf('#') === 0 ? location.hash : '#';
    const found = this._findInStack(url);
    if (!found) {
      const html = config.template;
      this.render(html)
      // if (!config.isBind) {
      //   this._bind(config);
      // }
      if (config.init) {
        const params = getUrlParams();
        config.init(params);
      }
      this._pageStack.push({
        config: config,
        dom: html
      });
    }
    else {
      this.render(found.dom);
      if (found.config.init) {
        const params = getUrlParams();
        found.config.init(params);
      }
    }

    return this;
  },
  _findInStack: function (url) {
    let found = null;
    for (let i = 0, len = this._pageStack.length; i < len; i++) {
      const stack = this._pageStack[i];
      if (stack.config.url === url) {
        found = stack;
        break;
      }
    }
    return found;
  },
  _find: function (key, value) {
    let page = null;
    for (let i = 0, len = this._configs.length; i < len; i++) {
      if (this._configs[i][key] === value) {
        page = this._configs[i];
        break;
      }
    }
    return page;
  },
  // _bind: function (page) {
  //   let events = page.events || {};
  //   for (let t in events) {
  //     for (let type in events[t]) {
  //       this.$container.querySelector(t).addEventListener(type, events[t][type]);
  //     }
  //   }
  //   page.isBind = true;
  // },
  render: function (html) {
    this.$container.innerHTML = html;
  },
  setNavbarActive: function (page) {
    const selector = `#navbar a[href="#${page.name}"]`;
    const active = document.querySelector(selector);
    if (active) {
      document.querySelectorAll('#navbar a').forEach(element => {
        element.classList.remove('active');
      });
      active.classList.add('active')
    }
    this.setNavTitle(page);
  },
  setNavTitle (page) {
    const name = page.name;
    let title = fineMenusName(name);
    const $title = document.querySelector('#nav-title');
    $title.innerText = title || 'REBORN';
    const toolbar = document.querySelector('.mdui-toolbar');
    if (title) {
      toolbar.classList.remove('menuIcon');
      toolbar.classList.add('backIcon');
    }
    else {
      toolbar.classList.remove('backIcon');
      toolbar.classList.add('menuIcon');
    }
  }
};

export default pageManager;
