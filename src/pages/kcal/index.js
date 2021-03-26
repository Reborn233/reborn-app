import tpl from './view.html';
import './style.less';
import { on, sumToArray, multiplyToArray } from '@/libs/utils';
const formula = {
  sport: {
    a: [2, 2],
    b: [50, 40],
    c: [2, 2.5]
  },
  nosport: {
    a: [1.5, 1.5],
    b: [50, 40],
    c: [1.5, 2]
  }
}

export default {
  name: 'kcal',
  template: tpl,
  init () {
    mdui.mutation();
    on('#kcalBtn', 'click', this.clickBtn.bind(this))
  },
  clickBtn () {
    const $kgInput = document.querySelector('#kg-input');
    const $check = document.querySelector('#check');
    const kg = $kgInput.value;
    const key = $check.checked ? 'sport' : 'nosport';
    if (this.valid(kg)) {
      this.calcKcal(kg, formula[key])
    }
  },
  calcKcal (kg, formula) {
    const akcal = multiplyToArray(kg * 4, formula.a);
    const bkcal = multiplyToArray(9, formula.b);
    const ckcal = multiplyToArray(kg * 4, formula.c)
    const ag = multiplyToArray(kg, formula.a);
    const bg = formula.b;
    const cg = multiplyToArray(kg, formula.c)
    const sumkcal = sumToArray(akcal, bkcal, ckcal);
    const kcals = [akcal, bkcal, ckcal, sumkcal];
    const gs = [ag, bg, cg, []];
    this.renderList(kcals, gs)
  },
  renderList (kcals, gs) {
    const $list = document.querySelector('#kcal-list');
    const array = ['protein', 'fat', 'carbohydrate', 'all']
    array.forEach((item, i) => {
      const $items = $list.querySelector(`.${item}`);
      const $spans = $items.querySelectorAll('span');
      $spans.forEach((span, j) => {
        const kcal = kcals[i][j];
        const g = gs[i][j];
        span.innerText = g ? `${g}g / ${kcal}kcal` : `${kcal}kcal`;
      })

    });

  },
  valid (value) {
    const $text = document.querySelector('#kg-input');
    if (value) {
      $text.parentNode.classList.remove('mdui-textfield-invalid');
      return true;
    }
    else {
      $text.parentNode.classList.add('mdui-textfield-invalid');
      return false;
    }
  }
}
