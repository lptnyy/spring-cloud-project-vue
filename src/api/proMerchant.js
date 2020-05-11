import axios from '@/libs/api.request'

/**
 * 查询
 * @param {} params
 */
export const getProMerchantPageList = (params) => {
  return axios.request({
    url: '/merchant/proMerchant/getPageList',
    method: 'post',
    data: params
  })
}

/**
 * 删除
 * @param {} params
 */
export const deleteProMerchant = (params) => {
  return axios.request({
    url: '/merchant/proMerchant/delete',
    method: 'post',
    data: params
  })
}

/**
 * 批量删除
 * @param {} params
 */
export const idsProMerchantDelete = (params) => {
  return axios.request({
    url: '/merchant/proMerchant/idsDelete',
    method: 'post',
    data: params
  })
}

/**
 * 修改
 * @param {} params
 */
export const updateProMerchant = (params) => {
  return axios.request({
    url: '/merchant/proMerchant/update',
    method: 'post',
    data: params
  })
}

/**
 * 保存
 * @param {} params
 */
export const saveProMerchant = (params) => {
  return axios.request({
    url: '/merchant/proMerchant/save',
    method: 'post',
    data: params
  })
}