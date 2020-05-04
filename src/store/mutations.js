export default {
  addCounter(state, payload) {
    payload.count +=1
  },
  addToCart(state, payload) {
    payload.checked = true
    state.carList.push(payload)
  },
  checkedChange(state, payload) {
    payload.checked = !payload.checked
  }
}
