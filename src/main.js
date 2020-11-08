// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'view-design'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import { directive as clickOutside } from 'v-click-outside-x'
import installPlugin from '@/plugin'
import './index.less'
import '@/assets/icons/iconfont.css'
import TreeTable from 'tree-table-vue'
import VOrgTree from 'v-org-tree'
import 'v-org-tree/dist/v-org-tree.css'
import Base from './base'

// 实际打包时应该不引入mock
/* eslint-disable */
if (process.env.NODE_ENV !== 'production') require('@/mock')

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(TreeTable)
Vue.use(VOrgTree)
Vue.use(Base)

/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)

/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false

/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config

/**
 * 注册指令
 */
importDirective(Vue)
Vue.directive('clickOutside', clickOutside)

// 创建高德地图
let createMap = () => {
  const promise = new Promise(function (resolve, reject) {
    let script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://webapi.amap.com/maps?v=1.3&key=7b97433a8172d71bba855f526cdda1ac'   // 高德地图
    document.body.appendChild(script)
    if (script.nodeName === 'SCRIPT') {
      resolve()
    } else {
      reject(new Error('Could not script image at ' + script.src))
    }
  })
  return promise
}
createMap().then(function () {
  console.log('读取高德地图成功')
  // 加載當前的ip定位
}).catch(function (error) {
  // 处理 getJSON 和 前一个回调函数运行时发生的错误
  console.log('发生错误！', error)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
