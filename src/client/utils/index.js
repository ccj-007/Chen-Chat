import wx from '../wx.mp3';

export function playAudio() {
  let mp3 = new Audio();
  mp3.muted = true;
  mp3.src = wx;
  mp3.load();
  mp3.muted = false;
  mp3.play();
}

export function showToast(str = 'default') {
  let toast = document.createElement('div');
  toast.className = 'toast';
  document.documentElement.appendChild(toast);
  toast.innerHTML = str;
  toast.addEventListener(
    'animationend',
    function () {
      document.documentElement.removeChild(toast);
    },
    false,
  );
  playAudio();
}

export function getTimestamp() {
  return Date.parse(new Date());
}
