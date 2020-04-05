import axios from '@/libs/api.request'
import user from '../store/module/user'

/**
 * 查询数据库表列表
 * @param {} params
 */
export const getTableList = (params) => {
  return axios.request({
    url: '/gen/db/tableList',
    method: 'post',
    data: params
  })
}

/**
 * 查询数据库表列表
 * @param {} params
 */
export const generator = (params) => {
  return axios.request({
    url: '/gen/db/generator',
    method: 'post',
    data: params,
    responseType: 'blob'
  })
}

/**
 * 查询数据库表列表
 * @param {} params
 */
export const downloadZip = () => {
  window.location.href = user.state.baseUrl + 'gen/db/downloadZip'
}
