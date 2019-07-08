export default class Utils {
  static setBearerToken = (token) => {
    localStorage.setItem('token', token);
  }

  static getBearerToken = () => {
    return localStorage.getItem('token');
  }

  static setUserInfo = (user) => {
    localStorage.setItem('userInfo', JSON.stringify(user));
  }

  static getUserInfo = () => {
    return JSON.parse(localStorage.getItem('userInfo'));
  } 
}