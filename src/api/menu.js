import axios from '@/libs/api.request'

/**
 * 查询数据库表列表
 * @param {} params
 */
export const getMenuList = (params) => {
  return axios.request({
    url: '/system/menu/getPageList',
    method: 'post',
    data: params
  })
}

/**
 * 查询数据库表列表
 * @param {} params
 */
export const menuSave = (params) => {
  return axios.request({
    url: '/system/menu/save',
    method: 'post',
    data: params
  })
}

/**
 * 查询数据库表列表
 * @param {} params
 */
export const idsDelete = (params) => {
  return axios.request({
    url: '/system/menu/idsDelete',
    method: 'post',
    data: params
  })
}

/**
 * 查询数据库表列表
 * @param {} params
 */
export const update = (params) => {
  return axios.request({
    url: '/system/menu/update',
    method: 'post',
    data: params
  })
}

/**
 * 查询此用户权限
 * @param {} params
 */
export const getUserMenus = (params) => {
  return axios.request({
    url: '/system/menu/getUserMenus',
    method: 'post',
    data: params
  })
}
