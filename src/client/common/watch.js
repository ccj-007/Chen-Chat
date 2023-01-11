import { addUser } from './user.js';
import { bossKey } from '../index';
import { showToast } from '../utils/index';
import { initMsgKeyEvent } from '../common/sendMsg';
import { socket } from '../index';

//ui render
const emo = document.querySelector('.emo');
const name = document.querySelector('.name');
const right = document.querySelector('.right');
const left = document.querySelector('.left');
const header = document.querySelector('.header');
const footer = document.querySelector('.footer');
const chat = document.querySelector('.chat');

//input
const inputUser = document.querySelector('.input-user');
const inputAdmin = document.querySelector('.input-admin');
const input = document.querySelector('.input');
//click
const createUser = document.querySelector('.createUser');
const submitAdmin = document.querySelector('.submitAdmin');
const delRecord = document.querySelector('.delRecord');
const delPlayer = document.querySelector('.delPlayer');
const disableChat = document.querySelector('.disableChat');
const bread = document.querySelector('.bread');

let rExpand = true;
export function watchDOMEvent(status) {
  /**
   * 监听侧边栏
   */
  bread.onclick = () => {
    rExpand = !rExpand;
    right.style.transform = `translateX(${rExpand ? '0vw' : '30vw'})`;
    left.style.width = rExpand ? '70%' : '100%';
    footer.style.width = rExpand ? '70%' : '100%';
    header.style.width = rExpand ? '70%' : '100%';
    chat.style.width = rExpand ? '70vw' : '100vw';
  };

  /**
   * 监听发送
   */
  input.oninput = (e) => {
    status.chat = e.target.value;
    input.value = e.target.value;
  };

  /**
   * 监听用户
   */
  inputUser.onchange = (e) => {
    status.username = e.target.value;
    inputUser.value = '';
    name.innerHTML = status.username;
  };

  /**
   * 权限
   */
  inputAdmin.oninput = (e) => {
    inputAdmin.value = e.target.value;
  };

  /**
   * 表情
   */
  emo.onclick = (e) => {
    console.log(e.target.textContent);
    let emo = e.target.textContent;
    input.value += emo;
  };

  /**
   * 创建用户
   */
  createUser.onclick = () => {
    addUser(status);
    showToast('😅 开聊！！');
  };

  /**
   * 删除记录
   */
  delRecord.onclick = () => {
    if (status.auth === 'admin') {
      socket.emit('del', 'chatData');
    } else {
      showToast('您无权限');
    }
  };

  /**
   * 删除用户
   */
  delPlayer.onclick = () => {
    if (status.auth === 'admin') {
      socket.emit('del', 'userList');
    } else {
      showToast('您无权限');
    }
  };

  /**
   * 申请权限
   */
  submitAdmin.onclick = () => {
    if (inputAdmin.value === bossKey) {
      status.auth = 'admin';
      showToast('恭喜你成为了管理员，请创建管理员用户');
    } else {
      status.auth = 'player';
      showToast('你好像没有权限！！');
    }
  };

  /**
   * 禁言
   */
  disableChat.onclick = () => {
    if (inputAdmin.value === bossKey) {
      socket.emit('disable', status.disable);
    } else {
      showToast('你好像没有权限！！');
    }
  };

  initMsgKeyEvent(status);
}
