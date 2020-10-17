import axios from '@/libs/api.request'

/**
 * 查询
 * @param {} params
 */
export const getProApiPageList = (params) => {
  return axios.request({
    url: '/system/proApi/getPageList',
    method: 'post',
    data: params
  })
}

/**
 * 删除
 * @param {} params
 */
export const deleteProApi = (params) => {
  return axios.request({
    url: '/system/proApi/delete',
    method: 'post',
    data: params
  })
}

/**
 * 批量删除
 * @param {} params
 */
export const idsProApiDelete = (params) => {
  return axios.request({
    url: '/system/proApi/idsDelete',
    method: 'post',
    data: params
  })
}

/**
 * 修改
 * @param {} params
 */
export const updateProApi = (params) => {
  return axios.request({
    url: '/system/proApi/update',
    method: 'post',
    data: params
  })
}

/**
 * 保存
 * @param {} params
 */
export const saveProApi = (params) => {
  return axios.request({
    url: '/system/proApi/save',
    method: 'post',
    data: params
  })
}
