import axios from '@/libs/api.request'

/**
 * 查询
 * @param {} params
 */
export const getProResourceFilePageList = (params) => {
  return axios.request({
    url: '/system/proResourceFile/getPageList',
    method: 'post',
    data: params
  })
}

/**
 * 删除
 * @param {} params
 */
export const deleteProResourceFile = (params) => {
  return axios.request({
    url: '/system/proResourceFile/delete',
    method: 'post',
    data: params
  })
}

/**
 * 批量删除
 * @param {} params
 */
export const idsProResourceFileDelete = (params) => {
  return axios.request({
    url: '/system/proResourceFile/idsDelete',
    method: 'post',
    data: params
  })
}

/**
 * 修改
 * @param {} params
 */
export const updateProResourceFile = (params) => {
  return axios.request({
    url: '/system/proResourceFile/update',
    method: 'post',
    data: params
  })
}

/**
 * 保存
 * @param {} params
 */
export const saveProResourceFile = (params) => {
  return axios.request({
    url: '/system/proResourceFile/save',
    method: 'post',
    data: params
  })
}
