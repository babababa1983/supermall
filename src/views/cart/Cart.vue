<template>
  <div class="cart">
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{cartLength}})</div>
    </nav-bar>
    <cart-list />

    <cart-button-bar/>
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import CarButtonBar from "./CartButtonBar";

  import CartList from "./CartList";
  import { mapGetters } from 'vuex'
  import CartButtonBar from "./CartButtonBar";

  export default {
    name: "Cart",
    components: {
      NavBar,
      CartList,
      CartButtonBar
    },
    computed: {
      ...mapGetters([
        'cartLength'
      ])
    }
  }
</script>

<style scoped>
  .cart {
    height: 100vh;
  }
 .nav-bar {
   background-color: var(--color-tint);
   color: #fff;
   /*font-weight: 700;*/
 }
</style>
