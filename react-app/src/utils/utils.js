export default class Utils {
  static saveBearerToken = (token) => {
    console.log('save');
    localStorage.setItem('token', token);
  }
}