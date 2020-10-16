import axios from '@/libs/api.request'

/**
 * 获取省份
 * @param access
 * @returns {http.ClientRequest | * | void | AxiosPromise<any> | ClientHttp2Stream}
 */
export const getProvince = (access) => {
  return axios.request({
    url: '/system/proProvince/getPageList',
    method: 'post',
    data: access
  })
}

/**
 * 获取城市
 * @param access
 * @returns {http.ClientRequest | * | void | AxiosPromise<any> | ClientHttp2Stream}
 */
export const getCity = (access) => {
  return axios.request({
    url: '/system/proCity/getPageList',
    method: 'post',
    data: access
  })
}

/**
 * 获取地区
 * @param access
 * @returns {http.ClientRequest | * | void | AxiosPromise<any> | ClientHttp2Stream}
 */
export const getArea = (access) => {
  return axios.request({
    url: '/system/proArea/getPageList',
    method: 'post',
    data: access
  })
}
