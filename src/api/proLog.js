import axios from '@/libs/api.request'

/**
 * 查询
 * @param {} params
 */
export const getProLogPageList = (params) => {
  return axios.request({
    url: '/system/proLog/getPageList',
    method: 'post',
    data: params
  })
}

/**
 * 删除
 * @param {} params
 */
export const deleteProLog = (params) => {
  return axios.request({
    url: '/system/proLog/delete',
    method: 'post',
    data: params
  })
}

/**
 * 批量删除
 * @param {} params
 */
export const idsProLogDelete = (params) => {
  return axios.request({
    url: '/system/proLog/idsDelete',
    method: 'post',
    data: params
  })
}

/**
 * 修改
 * @param {} params
 */
export const updateProLog = (params) => {
  return axios.request({
    url: '/system/proLog/update',
    method: 'post',
    data: params
  })
}

/**
 * 保存
 * @param {} params
 */
export const saveProLog = (params) => {
  return axios.request({
    url: '/system/proLog/save',
    method: 'post',
    data: params
  })
}
