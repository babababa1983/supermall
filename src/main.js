import Vue from 'vue'
import App from './App.vue'
import router from "./router/router";

Vue.config.productionTip = false

// 初始化一个Vue对象, 当作事件总线的实例
Vue.prototype.$bus = new Vue()

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
