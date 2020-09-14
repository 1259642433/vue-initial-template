import axios from 'axios'
import store from '@/store'

// 创建axios实例，并设置请求地址，超时时间
const service = axios.create({
  baseURL: process.env.VUE_APP_API,
  // withCredentials: true, // 跨域请求时发送cookie
  timeout: 5000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    if (store.state.user.token) {
      config.headers.xtoken = store.state.user.token
    }
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200) {
      if (res.code === 401) {
        // 401 鉴权验证失败
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default service
