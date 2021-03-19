import { template } from '../utils';
import tpl from './tpl.html';

function alert (content = '文字提示', type = 'warning') {
  const $alertWrap = template(tpl, {
    content,
    type
  });
  const $wrapper = document.querySelector('#alert-wrapper');
  $wrapper.innerHTML = $alertWrap;

  return $alertWrap;
}

export default alert;
