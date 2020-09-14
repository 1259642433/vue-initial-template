import Vue from 'vue'
import router from '@/router'
import * as api from '@/api'

Vue.prototype.$api = api
Vue.prototype.$toPage = toPage

export function toPage (params)  {
  // 如果目标路由与当前路由一致，不执行跳转
  if (params === router.history.current.fullPath || params.path === router.history.current.fullPath) {
    return
  }
  typeof params === 'string' ? router.push(params) : router.push({ ...params })
}