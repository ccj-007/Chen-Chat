import io from 'socket.io-client';
import { showToast } from './utils';
import { getEnv } from './utils/env';
import { watchDOMEvent } from './common/watch';
import { socketStart } from './socket/index';

export let socket = io(getEnv(), {
  reconnectionDelayMax: 1000,
});

export let bossKey = '1'; //申请管理员密钥

let status = {
  /** 会话id */
  sid: '',
  /** 当前用户id */
  uid: '',
  /** 当前用户名 */
  username: '',
  /** 权限 admin | player */
  auth: '',
  /** 当前输入聊天内容 */
  chat: '',
  /** 是否已经创建用户 */
  canCreate: false,
  /** 用户头像颜色 */
  avatarColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
    Math.random() * 256,
  )}, ${Math.floor(Math.random() * 256)})`,

  /** 禁言 */
  disable: false,
  /** 当前广播的用户名 */
  boardUsername: '',
  /** 用户列表 sid---userInfo */
  userList: new Map(),
  /** 聊天列表 */
  chatData: [],
};

function init() {
  showToast('🥳 文明交流！</br>有啥毛病加我QQ： 596487930');

  watchDOMEvent(status);
  socketStart(status);
}
init();
