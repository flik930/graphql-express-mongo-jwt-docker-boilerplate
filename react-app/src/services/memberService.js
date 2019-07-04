import config from '../config';
import {Get, Post, Put, Delete} from './baseService';
console.log(config)
const MemberService = {
  signup: (params) => Post({url: config.baseUrl + 'signup', params})
}

export default MemberService;