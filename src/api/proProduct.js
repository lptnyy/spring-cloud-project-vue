import axios from '@/libs/api.request'

/**
 * 查询
 * @param {} params
 */
export const getProProductPageList = (params) => {
  return axios.request({
    url: '/system/proProduct/getPageList',
    method: 'post',
    data: params
  })
}

/**
 * 查询
 * @param {} params
 */
export const getProProductInfo = (params) => {
  return axios.request({
    url: '/system/proProduct/get',
    method: 'post',
    data: params
  })
}

/**
 * 删除
 * @param {} params
 */
export const deleteProProduct = (params) => {
  return axios.request({
    url: '/system/proProduct/delete',
    method: 'post',
    data: params
  })
}

/**
 * 批量删除
 * @param {} params
 */
export const idsProProductDelete = (params) => {
  return axios.request({
    url: '/system/proProduct/idsDelete',
    method: 'post',
    data: params
  })
}

/**
 * 修改
 * @param {} params
 */
export const updateProProduct = (params) => {
  return axios.request({
    url: '/system/proProduct/update',
    method: 'post',
    data: params
  })
}

/**
 * 修改
 * @param {} params
 */
export const updateUpdateState = (params) => {
  return axios.request({
    url: '/system/proProduct/updateState',
    method: 'post',
    data: params
  })
}

/**
 * 保存
 * @param {} params
 */
export const saveProProduct = (params) => {
  return axios.request({
    url: '/system/proProduct/save',
    method: 'post',
    data: params
  })
}
