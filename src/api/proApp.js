import axios from '@/libs/api.request'

/**
 * 查询
 * @param {} params
 */
export const getProAppPageList = (params) => {
  return axios.request({
    url: '/system/proApp/getPageList',
    method: 'post',
    data: params
  })
}

/**
 * 删除
 * @param {} params
 */
export const deleteProApp = (params) => {
  return axios.request({
    url: '/system/proApp/delete',
    method: 'post',
    data: params
  })
}

/**
 * 批量删除
 * @param {} params
 */
export const idsProAppDelete = (params) => {
  return axios.request({
    url: '/system/proApp/idsDelete',
    method: 'post',
    data: params
  })
}

/**
 * 修改
 * @param {} params
 */
export const updateProApp = (params) => {
  return axios.request({
    url: '/system/proApp/update',
    method: 'post',
    data: params
  })
}

/**
 * 保存
 * @param {} params
 */
export const saveProApp = (params) => {
  return axios.request({
    url: '/system/proApp/save',
    method: 'post',
    data: params
  })
}
