import { store } from 'react-easy-state'

let gloableStore = store({
  loggedIn: false,
  userInfo: null
});

export default gloableStore;