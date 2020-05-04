export default {
  addProductToCart(context, payload) {
    return new Promise((resolve, reject) => {
      let hasProduct = context.state.carList.find(item => item.iid === payload.iid)
      if(hasProduct) {
        context.commit('addCounter', hasProduct)
        resolve('添加成功')
      }else { //新商品
        payload.count = 1
        context.commit('addToCart', payload)
        resolve('添加成功')
      }
    })
  },
  checkChange(context, payload) {
    context.commit('checkedChange', payload)
  }
}
