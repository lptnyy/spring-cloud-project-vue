import axios from '@/libs/api.request'

/**
 * 查询
 * @param {} params
 */
export const getXiaoshuoNovellistPageList = (params) => {
  return axios.request({
    url: '/xiaoshuo/xiaoshuoNovellist/getPageList',
    method: 'post',
    data: params
  })
}

/**
 * 删除
 * @param {} params
 */
export const deleteXiaoshuoNovellist = (params) => {
  return axios.request({
    url: '/xiaoshuo/xiaoshuoNovellist/delete',
    method: 'post',
    data: params
  })
}

/**
 * 批量删除
 * @param {} params
 */
export const idsXiaoshuoNovellistDelete = (params) => {
  return axios.request({
    url: '/xiaoshuo/xiaoshuoNovellist/idsDelete',
    method: 'post',
    data: params
  })
}

/**
 * 修改
 * @param {} params
 */
export const updateXiaoshuoNovellist = (params) => {
  return axios.request({
    url: '/xiaoshuo/xiaoshuoNovellist/update',
    method: 'post',
    data: params
  })
}

/**
 * 保存
 * @param {} params
 */
export const saveXiaoshuoNovellist = (params) => {
  return axios.request({
    url: '/xiaoshuo/xiaoshuoNovellist/save',
    method: 'post',
    data: params
  })
}
