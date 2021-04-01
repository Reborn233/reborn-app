let _sington;

function loading () {
  if (_sington) return _sington;
  const progress = document.querySelector('#progress');

  function _hide (callback) {
    _hide = function () { };
    progress.style.display = 'none';
    callback && callback();
  }

  function hide (callback) { _hide(callback); }
  progress.style.display = 'block';
  _sington = progress;
  _sington.hide = hide;

  return _sington
}
export default loading;
