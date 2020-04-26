<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control class="tab-control"
                 :titles="['流行', '新款', '精选']"
                 @tabClick="tabClick"
                 ref="homeTabControl1" v-show="isTabFixed"></tab-control>

    <!-- probe-type 驼峰改-; 加:传number类型  @scroll 对组件的自定义事件进行监听 -->
    <scroll class="content" ref="scroll"
            :probe-type="3" :pull-up-load="true"
            @scroll="contendScroll" @loadMore="loadMore">
      <home-swiper :banners="banners" @swiperImgLoad="swiperImgLoad"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control class="tab-control"
                   :titles="['流行', '新款', '精选']"
                   @tabClick="tabClick"
                   ref="homeTabControl2"></tab-control>
      <goods-list :goods="showGoodsByType"/>
    </scroll>

    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import TabControl from "components/content/tabControl/TabControl";
  import GoodsList from "components/content/goods/GoodsList";
  import Scroll from "components/common/scroll/Scroll";
  import BackTop from "components/content/backTop/BackTop";

  import HomeSwiper from "./HomeSwiper";
  import RecommendView from "./RecommendView";
  import FeatureView from "./FeatureView";

  import {getHomeMultiData, getHomeGoodsData} from "network/home";
  import {debounce} from "common/utils";

  export default {
    name: "Home",
    components: {
      NavBar,
      HomeSwiper,
      RecommendView,
      FeatureView,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []}
        },
        currentType: 'pop',
        isShowBackTop: false,
        tabOffSetTop: 0,
        isTabFixed: false,
        saveY: 0
      }
    },
    computed: {
      showGoodsByType() {
        return this.goods[this.currentType].list
      }
    },
    created() {
      this.getHomeMultiData();
      this.getHomeGoodsData('pop');
      this.getHomeGoodsData('new');
      this.getHomeGoodsData('sell');
    },
    mounted() {
      //监听商品列表组件图片加载完毕后的事件
      const refresh = debounce(this.$refs.scroll.refresh, 500)
      this.$bus.$on('itemImgLoaded', () => {
        //首先判断scroll对象是不是空
        refresh()
      })
    },
    activated() {
      this.$refs.scroll.scrollTo(0, this.saveY)
      this.$refs.scroll.refresh()
    },
    deactivated() {
      this.saveY = this.$refs.scroll.getScrollY()
    },
    methods: {
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop';
            break;
          case 1:
            this.currentType = 'new';
            break;
          case 2:
            this.currentType = 'sell';
            break;
          default: 'pop'
        }
        this.$refs.homeTabControl1.currentIndex = index
        this.$refs.homeTabControl2.currentIndex = index
      },
      backClick() {
        this.$refs.scroll.scrollTo(0, 0, 500)
      },
      contendScroll(position) {
        this.isShowBackTop = (-position.y) > 2000
        //tabControl是否吸顶
        this.isTabFixed = (-position.y) > this.tabOffSetTop
      },
      swiperImgLoad() {
        //获取tabbar的offsettop属性,以固定tabbar浮动效果
        //组件都有$el 属性来获取其dom元素
        this.tabOffSetTop = this.$refs.homeTabControl2.$el.offsetTop
      },
      //1. 请求多个数据
      getHomeMultiData() {
        getHomeMultiData().then(res => {
          this.banners = res.data.banner.list
          this.recommends = res.data.recommend.list
        })
      },
      //2. 请求商品信息
      getHomeGoodsData(type) {
        const page = this.goods[type].page + 1
        getHomeGoodsData(type, page).then(res => {
          //console.log(type+' --  '+this.goods[this.currentType].list.length)
          // ... 相当于for 循环遍历啦
          this.goods[type].list.push(...res.data.list);
          this.goods[type].page += 1
          //console.log(type+' --  '+this.goods[this.currentType].list.length)

          this.$refs.scroll.finishPullUp()
          this.$refs.scroll.refresh()
        })
      },
      //3. 下拉加载更多数据
      loadMore() {
        console.log('上拉加载更多')
        this.getHomeGoodsData(this.currentType)
      }
    }
  }
</script>

<style scoped>
  #home {
    /*padding-top: 44px;*/
    height: 100vh;
    position: relative;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #fff;

    /*浏览器原生滚动条的时候才适用*/
    /*position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;*/
  }

  .tab-control {
    /*position: sticky;
    top: 44px;
    z-index: 9;*/
    position: relative;
    z-index: 9;
  }

  .content {
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  /*.content {*/
  /*height: calc(100% - 93px);*/
  /*overflow: hidden;*/
  /*margin-top: 44px;*/
  /*}*/
</style>
