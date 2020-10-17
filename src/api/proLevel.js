import axios from '@/libs/api.request'

/**
 * 查询
 * @param {} params
 */
export const getProLevelPageList = (params) => {
  return axios.request({
    url: '/system/proLevel/getPageList',
    method: 'post',
    data: params
  })
}

/**
 * 删除
 * @param {} params
 */
export const deleteProLevel = (params) => {
  return axios.request({
    url: '/system/proLevel/delete',
    method: 'post',
    data: params
  })
}

/**
 * 批量删除
 * @param {} params
 */
export const idsProLevelDelete = (params) => {
  return axios.request({
    url: '/system/proLevel/idsDelete',
    method: 'post',
    data: params
  })
}

/**
 * 修改
 * @param {} params
 */
export const updateProLevel = (params) => {
  return axios.request({
    url: '/system/proLevel/update',
    method: 'post',
    data: params
  })
}

/**
 * 保存
 * @param {} params
 */
export const saveProLevel = (params) => {
  return axios.request({
    url: '/system/proLevel/save',
    method: 'post',
    data: params
  })
}
