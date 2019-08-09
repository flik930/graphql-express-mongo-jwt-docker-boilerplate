import globalStore from '../stores/globalStore';

export default class Utils {
  static setBearerToken = (token) => {
    localStorage.setItem('token', token);
  }

  static getBearerToken = () => {
    return localStorage.getItem('token');
  }

  static updateUserInfo = (data) => {
    globalStore.userInfo.name = data.displayName;
    globalStore.userInfo.pictureUrl = data.pictureUrl;
  }
}