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
  