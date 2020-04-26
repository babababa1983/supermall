<template>
  <ul class="wrapper" ref="wra">
    <ul class="content">
      <button @click="btnClick">点击</button>
      <li v-for="i in 50">{{i}}</li>
    </ul>
  </ul>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name: "Category",
    data() {
      return {
        scroll: null
      }
    },
    //组件渲染成html之前
    created() {
    },
    //组件渲染成html之后
    //probeType: 2 监听滑动,手离开就不监听了; 3 监听滑动, 手离开继续监听,直到屏幕静止
    //pullUpLoad 监听拉到最后一行数据的动作
    mounted() {
      this.scroll = new BScroll(this.$refs.wra, {
        probeType: 3,
        pullUpLoad: true
      })
      this.scroll.on('scroll', (position) => {
        //console.log(position)
      })
      this.scroll.on('pullingUp', () => {
        console.log('上拉加载更多')
      })
    },
    methods: {
      btnClick() {
        console.log('被点击了')
      }
    }
  }
</script>

<style scoped>
  .wrapper {
    height: 150px;
    background-color: #00ee00;
    overflow: hidden;
  }
</style>
