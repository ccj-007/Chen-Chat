import { addUser } from '../common/user.js';
import {
  updateChatList,
  updateUserList,
  updatePeoples,
} from '../common/renderlist';
import { showToast, getTimestamp } from '../utils/index';
import { socket } from '../index';
import { v4 as uuidv4 } from 'uuid';
/**
 * 接受服务端数据
 */
export function socketStart(status) {
  socket.on('connect', function () {
    //新增用户
    if (status.canCreate) {
      addUser(status);
    } else {
      console.warn('请先创建用户');
    }

    /**
     * 初始渲染
     */
    socket.on('init', (e) => {
      console.log('111111111111111111');
      let userList = e.userList.filter((item) => item.username);
      status.userList = new Map(userList);
      status.chatData = e.chatData;
      updateChatList(status);
      updateUserList(status);
    });

    /**
     * 广播
     */
    socket.on('global', (e) => {
      showToast(e);
    });

    /**
     * 禁言
     */
    socket.on('disabled', (e) => {
      status.disable = e;
      status.disable ? showToast('禁言啦！') : showToast('已经解除禁言');
    });

    /**
     * 已经加入房间
     */
    socket.on('joined', (e) => {
      status = e;
    });

    /**
     * 聊天
     */
    socket.on('chat', (e) => {
      status.chatData = e;
      updateChatList(status);
    });

    /**
     * 退出
     */
    socket.on('quit', (sid, item) => {
      alert('5555555555555');
      const user = status.userList.get(sid);
      status.userList.delete(sid);
      if (user.name) {
        socket.emit('message', {
          ...status,
          type: 'quit',
          content: user.name + '退出群聊~',
          timestamp: getTimestamp(),
          cid: uuidv4(), //文本id
          boardUsername: user.name,
        });

        updateChatList(status);
        updateUserList(status);
      }
    });

    /**
     * 用户首次进入
     */
    socket.on(
      'welcome',
      ({ username: boardUsername, auth, uList, otherInfo }) => {
        if (uList.length) {
          status.userList = new Map();
          uList.forEach((item) => {
            const [id, value] = item;
            status.userList.set(id, value);
          });
        }
        let { username } = status;

        if (username && username === boardUsername) {
          socket.emit('message', {
            ...status,
            type: 'welcome',
            cid: uuidv4(),
            timestamp: getTimestamp(),
            content: '欢迎' + boardUsername + '加入群聊~',
            boardUsername: boardUsername,
            auth,
          });
        }
        updateUserList(status);
        updatePeoples(status);
      },
    );
  });
}
