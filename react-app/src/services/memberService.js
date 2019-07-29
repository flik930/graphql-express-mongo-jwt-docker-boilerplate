import config from '../config';
import {Get, Post, Put, Delete, getGqlClient} from './baseService';
import { gql } from "apollo-boost";

const gqlClient = getGqlClient();

const MemberService = {
  emailLogin: (params) => Post({url: config.baseUrl + 'login', params}),
  signup: (params) => Post({url: config.baseUrl + 'signup', params}),
  facebookLogin: (params) => Post({url: config.baseUrl + 'auth/facebook', params}),
  forgotPassword: (params) => Post({url: config.baseUrl + 'forgot', params}),
  resetPassword: (params) => Post({url: config.baseUrl + 'reset', params}),
  getUserInfo: () => gqlClient.query({
    query: gql`
      {
        me {
          email
        }
      }
    `
  })
}

export default MemberService;