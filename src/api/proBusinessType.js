import axios from '@/libs/api.request'

/**
 * 查询
 * @param {} params
 */
export const getProBusinessTypePageList = (params) => {
  return axios.request({
    url: '/system/proBusinessType/getPageList',
    method: 'post',
    data: params
  })
}

/**
 * 查询
 * @param {} params
 */
export const getProBusinessTypeList = (params) => {
  return axios.request({
    url: '/system/proBusinessType/getList',
    method: 'post',
    data: params
  })
}

/**
 * 删除
 * @param {} params
 */
export const deleteProBusinessType = (params) => {
  return axios.request({
    url: '/system/proBusinessType/delete',
    method: 'post',
    data: params
  })
}

/**
 * 批量删除
 * @param {} params
 */
export const idsProBusinessTypeDelete = (params) => {
  return axios.request({
    url: '/system/proBusinessType/idsDelete',
    method: 'post',
    data: params
  })
}

/**
 * 修改
 * @param {} params
 */
export const updateProBusinessType = (params) => {
  return axios.request({
    url: '/system/proBusinessType/update',
    method: 'post',
    data: params
  })
}

/**
 * 保存
 * @param {} params
 */
export const saveProBusinessType = (params) => {
  return axios.request({
    url: '/system/proBusinessType/save',
    method: 'post',
    data: params
  })
}
