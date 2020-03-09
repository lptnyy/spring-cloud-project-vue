import axios from '@/libs/api.request'

export const login = ({ userName, password }) => {
  return axios.request({
    url: '/auth/oauth/token?client_id=lptnyy&client_secret=wangyang119&grant_type=password&username=' + userName + '&password=' + password,
    method: 'get'
  })
}

export const getUserInfo = () => {
  return axios.request({
    url: '/auth/userInfo',
    method: 'get'
  })
}

export const getUserList = (params) => {
  return axios.request({
    url: '/system/user/userPageList',
    method: 'post',
    data: params
  })
}

export const logout = (token) => {
  return axios.request({
    url: '/auth/oauth/exit',
    method: 'post',
    params: {
      access_token: token
    }
  })
}

export const updateStats = (params) => {
  return axios.request({
    url: '/system/user/updateStats',
    method: 'post',
    data: params
  })
}

export const deleteUser = (params) => {
  return axios.request({
    url: '/system/user/delete',
    method: 'post',
    data: params
  })
}

export const updateUser = (params) => {
  return axios.request({
    url: '/system/user/update',
    method: 'post',
    data: params
  })
}

export const getUnreadCount = () => {
  return axios.request({
    url: 'message/count',
    method: 'get'
  })
}

export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}
