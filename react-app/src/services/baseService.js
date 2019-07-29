import config from '../config';
import axios from 'axios';
import isEmpty from 'lodash/isEmpty';
import queryString from 'query-string';
import ApolloClient from "apollo-boost";
import Utils from '../utils/utils';

let instance;
let gqlInstance;
let token;

export const getGqlClient = () => {
  if (!gqlInstance) {
    if (!token) {
      token = Utils.getBearerToken();
    }
    gqlInstance = new ApolloClient({
      uri: config.graphQLuri,
      request: async (operation) => {
        operation.setContext({
          headers: {
            authorization: `Bearer ${token}`
          }
        })
      }
    });
  }
  return gqlInstance;
}

const getDefaultOptions = () => {
  let token = Utils.getBearerToken();
  console.log(token)
  return {
    baseURL: config.baseURL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': !!token ? `Bearer ${token}` : '',
      'Cache-Control': 'no-cache,no-store,must-revalidate,max-age=-1,private',
      'X-Requested-With': 'XMLHttpRequest',
      'Expires': "-1"
    },
  };
}

// If instance is not set, create a new instance
const getInstance = () => {
  if (!instance) {
    console.log('hit')
    const defaultOptions = getDefaultOptions();
    instance = axios.create(defaultOptions);
  }
  return instance;
}

export const encodeGetParams = (params) => {
  if (!params || isEmpty(params)) {
    return undefined;
  }
  params = {...params};
  const keys = Object.keys(params);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (!!params[key] && params[key]._isAMomentObject) {
      params[key] = params[key].toISOString();
    }
  }
  return queryString.stringify(params);
}

export const Get = ({url, params}) => {
  params = encodeGetParams(params);
  if (!!params) {
    if (-1 !== url.indexOf('?')) {
      console.warn(`Url ${url} already contains '?', please remove ? to pass params`);
    }
    url += '?';
    url += params;
  }
  return getInstance().get(url);
}
export const Put = ({url, params}) => {
  return getInstance().put(url, params);
}
export const Post = ({url, params}) => {
  return getInstance().post(url, params);
}
export const Patch = ({url, params}) => {
  return getInstance().patch(url, params);
}
export const Delete = ({url, params}) => {
  return getInstance().delete(url, { data: params });
}

