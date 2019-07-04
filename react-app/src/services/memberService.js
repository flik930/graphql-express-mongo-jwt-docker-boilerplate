import config from '../config';
import {Get, Post, Put, Delete} from './baseService';
console.log(config)
const MemberService = {
  signup: (params) => {console.log('post', config.baseUrl + 'signup'); Post({url: config.baseUrl + 'signup', params})}
}

export default MemberService;