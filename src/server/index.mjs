import { Server } from 'socket.io';

const io = new Server(5432, { cors: true });

let userList = new Map();
let chatData = [];
let disable = false;

io.on('connection', (socket) => {
  console.log('连接成功');
  /**
   * 接受客户端的消息
   */
  socket.on('message', (e) => {
    //去掉重复的退出消息
    if (chatData.length) {
      let endNode = chatData[chatData.length - 1];
      if (
        endNode.type === 'quit' &&
        endNode.boardUsername &&
        endNode.boardUsername === e.boardUsername
      ) {
        return;
      }
      if (
        endNode.type === 'welcome' &&
        e.type === 'welcome' &&
        endNode.username === e.username
      ) {
        return;
      }
    }
    chatData.push(e);
    socket.broadcast.emit('chat', chatData);
    socket.emit('chat', chatData);
  });

  /**
   * 是否禁言
   */
  socket.on('disable', (e) => {
    disable = !e;

    socket.broadcast.emit('disabled', disable);
    socket.emit('disabled', disable);
  });

  /**
   * 发送客户端广播
   */
  function sendGlobalMsg(params) {
    socket.broadcast.emit('global', params);
    socket.emit('global', params);
  }

  /**
   * 删除数据
   */
  socket.on('del', (e) => {
    if (e === 'userList') {
      userList = new Map();
      sendGlobalMsg('清退房间用户啦！');
    }
    if (e === 'chatData') {
      chatData = [];
      sendGlobalMsg('管理员清屏啦！');
    }
    initData();
  });

  /**
   * 初始数据
   */
  function initData() {
    socket.emit('init', { chatData, userList: [...userList.entries()] });
    socket.broadcast.emit('init', {
      chatData,
      userList: [...userList.entries()],
    });
  }
  initData();

  /**
   * 断开连接
   */
  socket.on('disconnecting', () => {
    const item = userList.get(socket.id);
    userList.delete(socket.id);

    socket.broadcast.emit('quit', socket.id, item);
    socket.emit('quit', socket.id, item);
  });

  /**
   * 监听新用户加入
   */
  socket.on('join', (e) => {
    if (!e.username) return;
    userList.set(socket.id, e);

    socket.emit('joined', e);

    const uList = [...userList.entries()];

    if (e.auth === 'admin') {
      socket.broadcast.emit('global', '🥳 管理员大人进房间啦！');
    }
    // 触发广播
    socket.broadcast.emit('welcome', {
      ...e,
      uList,
      otherInfo: {
        disable,
      },
    });
    // 自己展示加入的信息
    socket.emit('welcome', {
      ...e,
      uList,
      otherInfo: {
        disable,
      },
    });
  });
});
