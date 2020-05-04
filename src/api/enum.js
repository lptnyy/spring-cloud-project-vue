import axios from '@/libs/api.request'

/**
 * 查询数据库表列表
 * @param {} params
 */
export const getEnumPageList = (params) => {
  return axios.request({
    url: '/system/proEnum/getPageList',
    method: 'post',
    data: params
  })
}

/**
 * 查询数据库表列表
 * @param {} params
 */
export const getEnumList = (params) => {
  return axios.request({
    url: '/system/proEnum/getList',
    method: 'post',
    data: params
  })
}

/**
 * 删除
 * @param {} params
 */
export const deleteEnum = (params) => {
  return axios.request({
    url: '/system/proEnum/delete',
    method: 'post',
    data: params
  })
}

/**
 * 批量删除
 * @param {} params
 */
export const idsDelete = (params) => {
  return axios.request({
    url: '/system/proEnum/idsDelete',
    method: 'post',
    data: params
  })
}

/**
 * 修改
 * @param {} params
 */
export const updateEnum = (params) => {
  return axios.request({
    url: '/system/proEnum/update',
    method: 'post',
    data: params
  })
}

/**
 * 删除
 * @param {} params
 */
export const saveEnum = (params) => {
  return axios.request({
    url: '/system/proEnum/save',
    method: 'post',
    data: params
  })
}
