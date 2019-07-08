import config from '../config';
import {Get, Post, Put, Delete} from './baseService';
console.log(config)
const MemberService = {
  signup: (params) => Post({url: config.baseUrl + 'signup', params}),
  facebookLogin: (params) => Post({url: config.baseUrl + 'auth/facebook', params})
}

export default MemberService;