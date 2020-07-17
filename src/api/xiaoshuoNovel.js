import axios from '@/libs/api.request'

/**
 * 查询
 * @param {} params
 */
export const getXiaoshuoNovelPageList = (params) => {
  return axios.request({
    url: '/xiaoshuo/xiaoshuoNovel/getPageList',
    method: 'post',
    data: params
  })
}

/**
 * 删除
 * @param {} params
 */
export const deleteXiaoshuoNovel = (params) => {
  return axios.request({
    url: '/xiaoshuo/xiaoshuoNovel/delete',
    method: 'post',
    data: params
  })
}

/**
 * 批量删除
 * @param {} params
 */
export const idsXiaoshuoNovelDelete = (params) => {
  return axios.request({
    url: '/xiaoshuo/xiaoshuoNovel/idsDelete',
    method: 'post',
    data: params
  })
}

/**
 * 修改
 * @param {} params
 */
export const updateXiaoshuoNovel = (params) => {
  return axios.request({
    url: '/xiaoshuo/xiaoshuoNovel/update',
    method: 'post',
    data: params
  })
}

/**
 * 保存
 * @param {} params
 */
export const saveXiaoshuoNovel = (params) => {
  return axios.request({
    url: '/xiaoshuo/xiaoshuoNovel/save',
    method: 'post',
    data: params
  })
}
