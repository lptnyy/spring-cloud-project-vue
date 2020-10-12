import axios from '@/libs/api.request'

/**
 * 查询
 * @param {} params
 */
export const getProMemberPageList = (params) => {
  return axios.request({
    url: '/system/proMember/getPageList',
    method: 'post',
    data: params
  })
}

/**
 * 删除
 * @param {} params
 */
export const deleteProMember = (params) => {
  return axios.request({
    url: '/system/proMember/delete',
    method: 'post',
    data: params
  })
}

/**
 * 批量删除
 * @param {} params
 */
export const idsProMemberDelete = (params) => {
  return axios.request({
    url: '/system/proMember/idsDelete',
    method: 'post',
    data: params
  })
}

/**
 * 修改
 * @param {} params
 */
export const updateProMember = (params) => {
  return axios.request({
    url: '/system/proMember/update',
    method: 'post',
    data: params
  })
}

/**
 * 保存
 * @param {} params
 */
export const saveProMember = (params) => {
  return axios.request({
    url: '/system/proMember/save',
    method: 'post',
    data: params
  })
}
