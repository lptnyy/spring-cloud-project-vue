import axios from '@/libs/api.request'

/**
 * 查询
 * @param {} params
 */
export const getProBusinessPageList = (params) => {
  return axios.request({
    url: '/system/proBusiness/getPageList',
    method: 'post',
    data: params
  })
}

/**
 * 删除
 * @param {} params
 */
export const deleteProBusiness = (params) => {
  return axios.request({
    url: '/system/proBusiness/delete',
    method: 'post',
    data: params
  })
}

/**
 * 批量删除
 * @param {} params
 */
export const idsProBusinessDelete = (params) => {
  return axios.request({
    url: '/system/proBusiness/idsDelete',
    method: 'post',
    data: params
  })
}

/**
 * 修改
 * @param {} params
 */
export const updateProBusiness = (params) => {
  return axios.request({
    url: '/system/proBusiness/update',
    method: 'post',
    data: params
  })
}

/**
 * 保存
 * @param {} params
 */
export const saveProBusiness = (params) => {
  return axios.request({
    url: '/system/proBusiness/save',
    method: 'post',
    data: params
  })
}
