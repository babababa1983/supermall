import Vue from 'vue'
import App from './App.vue'
import router from "./router/router";
import store from "./store/store";
import toast from "components/common/toast"
import fastClick from 'fastclick'
import VueLazyload from "vue-lazyload";

Vue.config.productionTip = false

// 初始化一个Vue对象, 当作事件总线的实例
Vue.prototype.$bus = new Vue()
Vue.use(toast)
Vue.use(VueLazyload, {
  loading: require('assets/img/common/placeholder.png')
})
//解决移动端300ms延迟问题
fastClick.attach(document.body)

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
