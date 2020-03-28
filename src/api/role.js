import axios from '@/libs/api.request'

/**
 * 查询数据库表列表
 * @param {} params
 */
export const getRolePageList = (params) => {
  return axios.request({
    url: '/system/proRole/getPageList',
    method: 'post',
    data: params
  })
}

/**
 * 删除
 * @param {} params
 */
export const deleteRole = (params) => {
  return axios.request({
    url: '/system/proRole/delete',
    method: 'post',
    data: params
  })
}

/**
 * 删除
 * @param {} params
 */
export const saveRole = (params) => {
  return axios.request({
    url: '/system/proRole/save',
    method: 'post',
    data: params
  })
}

/**
 * 保存角色菜单
 * @param {} params
 */
export const saveRoleMenu = (params) => {
  return axios.request({
    url: '/system/proRoleMenu/save',
    method: 'post',
    data: params
  })
}

/**
 * 获取所有角色信息
 * @param {} params
 */
export const getRoleList = (params) => {
  return axios.request({
    url: '/system/proRole/getList',
    method: 'post',
    data: params
  })
}

/**
 * 设置管理员角色
 * @param {} params
 */
export const saveAdminRole = (params) => {
  return axios.request({
    url: '/system/proUserRole/save',
    method: 'post',
    data: params
  })
}
