import axios from '@/libs/api.request'

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
