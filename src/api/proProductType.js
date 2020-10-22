import axios from '@/libs/api.request'

/**
 * 查询
 * @param {} params
 */
export const getProProductTypePageList = (params) => {
  return axios.request({
    url: '/system/proProductType/getPageList',
    method: 'post',
    data: params
  })
}

/**
 * 查询
 * @param {} params
 */
export const getTypes = (params) => {
  return axios.request({
    url: '/system/proProductType/getTypes',
    method: 'post',
    data: params
  })
}

/**
 * 查询
 * @param {} params
 */
export const getProProductTypeList = (params) => {
  return axios.request({
    url: '/system/proProductType/getList',
    method: 'post',
    data: params
  })
}

/**
 * 删除
 * @param {} params
 */
export const deleteProProductType = (params) => {
  return axios.request({
    url: '/system/proProductType/delete',
    method: 'post',
    data: params
  })
}

/**
 * 批量删除
 * @param {} params
 */
export const idsProProductTypeDelete = (params) => {
  return axios.request({
    url: '/system/proProductType/idsDelete',
    method: 'post',
    data: params
  })
}

/**
 * 修改
 * @param {} params
 */
export const updateProProductType = (params) => {
  return axios.request({
    url: '/system/proProductType/update',
    method: 'post',
    data: params
  })
}

/**
 * 保存
 * @param {} params
 */
export const saveProProductType = (params) => {
  return axios.request({
    url: '/system/proProductType/save',
    method: 'post',
    data: params
  })
}
