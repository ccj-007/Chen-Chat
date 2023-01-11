import { bossKey, socket } from '../index';
import { v4 as uuidv4 } from 'uuid';

const uidPrefix = 'uid_';

export function addUser(status) {
  const { username } = status;
  let inputAdmin = document.querySelector('.input-admin');

  status.sid = socket.id;
  status.canCreate = true;

  let newUser = {
    ...status,
    canCreate: true,
    sid: socket.id,
    username: username || Date.parse(new Date()) + '默认用户',
    auth: inputAdmin.value === bossKey ? 'admin' : 'player',

    uid: uidPrefix + uuidv4(),
  };
  console.log('新用户信息============', newUser);

  socket.emit('join', newUser);
}
