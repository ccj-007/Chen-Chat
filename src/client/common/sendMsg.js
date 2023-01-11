import { socket } from '../index';
import { showToast, playAudio, getTimestamp } from '../utils/index';
import { v4 as uuidv4 } from 'uuid';

export function handleSendMsg(status) {
  let input = document.querySelector('.input');
  if (!status.canCreate) {
    showToast('请先创建用户');
    return;
  }
  if (status.disable) {
    if (status.auth !== 'admin') {
      showToast('禁言啦！只有管理员可以聊！');
      return;
    }
  }
  if (!input.value) {
    showToast('不能输入空内容');
    return;
  }

  let data = {
    ...status,
    type: 'chat',
    cid: uuidv4(),
    timestamp: getTimestamp(),
    content: input.value,
  };
  console.log('发送服务端的消息=====', data);

  socket.emit('message', data);
  playAudio();

  input.value = '';
}

export function initMsgKeyEvent(status) {
  let sendMsg = document.querySelector('.sendMsg');
  sendMsg.onclick = () => {
    handleSendMsg(status);
  };
  document.onkeydown = function (e) {
    if (e.keyCode === 13) {
      handleSendMsg(status);
    }
  };
}
