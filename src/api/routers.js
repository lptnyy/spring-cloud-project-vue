import axios from '@/libs/api.request'

export const getRouterReq = (access) => {
  return axios.request({
    url: '/system/menu/getUserMenus',
    method: 'post',
    data: access
  })
}

/**
 * 查询此用户权限
 * @param {} params
 */
export const getUserPerms = (params) => {
  return axios.request({
    url: '/system/menu/getUserMenus',
    method: 'post',
    data: params
  })
}
