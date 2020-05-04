import Toast from "./Toast";

const obj = {}

obj.install = function (Vue) {
  //1. 创建组件构造器
  const constructor = Vue.extend(Toast);
  //2. 根据组件构造器,创建组件对象
  const toast = new constructor();
  //3. 建组件对象, 手动挂载到dom元素中
  toast.$mount(document.createElement('div'))
  document.body.appendChild(toast.$el)

  Vue.prototype.$toast = toast;
}

export default obj
