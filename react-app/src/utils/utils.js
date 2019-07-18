
export default class Utils {
  static setBearerToken = (token) => {
    localStorage.setItem('token', token);
  }

  static getBearerToken = () => {
    return localStorage.getItem('token');
  }
}