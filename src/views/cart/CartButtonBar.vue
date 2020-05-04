<template>
  <div class="button-bar">
    <div class="check-content">
      <check-button class="check-button" :is-checked="isSelectAll" @click.native="checkAllClick"/>
      <span>全选</span>
    </div>

    <div class="total-price">
      合计: {{totalPrice}}
    </div>

    <div class="calculate" @click="calcClick">
      去结账: ({{checkedCount}})
    </div>
  </div>
</template>

<script>
  import CheckButton from "components/content/checkButton/CheckButton";
  export default {
    name: "CartButtonBar",
    components: {
      CheckButton
    },
    methods: {
      checkAllClick() {
        if(this.isSelectAll) {
          this.$store.getters.cartList.forEach(item => item.checked = false)
        }else {
          this.$store.getters.cartList.forEach(item => item.checked = true)
        }
      },
      calcClick() {
        if(this.checkedCount<1) {
          this.$toast.show('请选择商品')
        }
      }
    },
    computed: {
      totalPrice() {
        const cartList = this.$store.getters.cartList;
        return cartList.filter(item => {
          return item.checked
        }).reduce((preValue, item) => {
          return preValue + item.count * item.price
        }, 0).toFixed(2)
      },
      checkedCount() {
        return this.$store.getters.cartList.filter(item => item.checked).length;
      },
      isSelectAll() {
        if(this.$store.getters.cartList.length === 0) {
          return false
        } else {
          return !this.$store.getters.cartList.find(item => !item.checked)
        }
      }
    }
  }
</script>

<style scoped>
  .button-bar {
    height: 40px;
    position: relative;
    bottom: 135px;
    line-height: 40px;
    background-color: #eee;
    display: flex;
    font-size: 14px;
  }

  .check-content {
    display: flex;
    align-items: center;
    margin-left: 10px;
    width: 80px;
  }

  .check-button {
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 10px;
  }

  .total-price {
    margin-left: 30px;
    flex: 1;
  }

  .calculate {
    width: 120px;
    background-color: red;
    color: white;
    text-align: center;
  }
</style>
