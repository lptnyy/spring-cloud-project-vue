import axios from '@/libs/api.request'

/**
 * 查询
 * @param {} params
 */
export const getXiaoshuoNoveltypePageList = (params) => {
  return axios.request({
    url: '/xiaoshuo/xiaoshuoNoveltype/getPageList',
    method: 'post',
    data: params
  })
}

/**
 * 删除
 * @param {} params
 */
export const deleteXiaoshuoNoveltype = (params) => {
  return axios.request({
    url: '/xiaoshuo/xiaoshuoNoveltype/delete',
    method: 'post',
    data: params
  })
}

/**
 * 批量删除
 * @param {} params
 */
export const idsXiaoshuoNoveltypeDelete = (params) => {
  return axios.request({
    url: '/xiaoshuo/xiaoshuoNoveltype/idsDelete',
    method: 'post',
    data: params
  })
}

/**
 * 修改
 * @param {} params
 */
export const updateXiaoshuoNoveltype = (params) => {
  return axios.request({
    url: '/xiaoshuo/xiaoshuoNoveltype/update',
    method: 'post',
    data: params
  })
}

/**
 * 保存
 * @param {} params
 */
export const saveXiaoshuoNoveltype = (params) => {
  return axios.request({
    url: '/xiaoshuo/xiaoshuoNoveltype/save',
    method: 'post',
    data: params
  })
}
