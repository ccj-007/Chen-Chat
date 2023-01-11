/**
 * 更新用户列表
 */
export function updateUserList(status) {
  const { username, userList } = status;
  if (!userList || !userList.entries) return;
  let lists = document.querySelector('.list-items');
  let str = '';
  for (const [sid, userInfo] of userList.entries()) {
    if (userInfo.auth === 'admin') {
      str += `<div class='user-admin'>${userInfo.username}</div>`;
    } else {
      str += `<div class='${
        userInfo.username === username ? 'user-cur' : 'user-other'
      }'>${userInfo.username}</div>`;
    }
  }

  lists.innerHTML = str;
}

/**
 * 更新聊天列表
 */
export function updateChatList(status) {
  const { username, chatData } = status;
  if (!chatData) return;

  let chat = document.querySelector('.chat-list');
  let chatList = document.querySelector('.chat');
  let str = '';
  for (const item of chatData) {
    if (item.type === 'chat') {
      console.log('111111222222222222222', item, status);
      if (item.username === username) {
        str += `<div class='chat-item-right'>
        <div class='chat-own chat-base' >${item.content}</div>
          <div class='avatar' style='background: ${
            item.avatarColor
          }'>${item.username.substring(0, 1)}</div>
        </div>`;
      } else {
        str += `<div class='chat-item-left'>
        <div class='avatar' style='background: ${
          item.avatarColor
        }'>${item.username.substring(0, 1)}</div>
        <div class='chat-other chat-base' >${item.content}</div>
        </div>`;
      }
    }
    if (item.type === 'welcome' || item.type === 'quit') {
      str += `<div class='chat-tips-warp'>
        <div class='chat-tips'>${item.content}</div>
        </div>`;
    }
  }
  chat.innerHTML = str;

  chatList.scroll({
    top: chatList.scrollHeight,
    behavior: 'smooth',
  });
}

/**
 * 更新人数
 */
export function updatePeoples(status) {
  let ps = document.querySelector('.peoples');
  ps.innerHTML = status.userList.size;
  console.log('000000000000000000000', status.userList.size);
}
