<template>
  <div id="goodsDetail">
    <detail-nav-bar class="detail-nav"  @detailTitleClick="detailTitleClick" ref="detailnav"/>
    <scroll class="content"
            ref="scroll"
            @scroll="contentScroll"
            :data="[topImages, goods, shop, detailInfo, paramInfo]"
            :probe-type="3">
      <detail-swiper :top-images="topImages" ref="base"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info :param-info="paramInfo" ref="param"/>
      <detail-comment-info :comment-info="commentInfo" ref="comment"/>
      <goods-list :goods="recommends" ref="recommend"/>

    </scroll>
    <detail-bottom-bar @addToCart="addToCart"/>
    <back-top @click.native="backClick" v-show="showBackTop">
      <img src="~assets/img/common/top.png" alt="">
    </back-top>

    <toast :message="toastMessage" :show="toastShow"/>
  </div>
</template>

<script>
  import DetailNavBar from './DetailNavBar'
  import DetailSwiper from "./DetailSwiper";
  import DetailBaseInfo from "./DetailBaseInfo";
  import DetailShopInfo from "./DetailShopInfo";
  import DetailGoodsInfo from "./DetailGoodsInfo";
  import DetailParamInfo from "./DetailParamInfo";
  import DetailCommentInfo from "./DetailCommentInfo";
  import DetailBottomBar from "./DetailBottomBar";

  import {BACKTOP_DISTANCE} from "@/common/const";

  import Scroll from "components/common/scroll/Scroll";
  import Toast from "components/common/toast/Toast";
  import BackTop from 'components/content/backTop/BackTop'
  import GoodsList from "components/content/goods/GoodsList";

  import {getGoodsDetailById,Goods,Shop,GoodsParam,getRecommend} from "network/detail";
  import {itemListenerMixin} from "common/mixin";
  import {debounce} from "common/utils";


  export default {
    name: "Detail",
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,
      BackTop,
      GoodsList,
      Scroll,
      Toast
    },
    //mixins: [itemListenerMixin],
    data() {
      return {
        iid: 0,
        showBackTop: false,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTops: [],
        getThemeTopY: null,
        currentIndex: 0,
        toastMessage: "",
        toastShow: false
      }
    },
    created() {
      this.iid = this.$route.params.iid

      //根据商品id获取商品信息
      getGoodsDetailById(this.iid).then(res => {
        const data = res.result
        // 1. 获取顶部轮播图片数据
        this.topImages = data.itemInfo.topImages
        // 2. 获取商品标题信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
        // 3. 获取店铺信息
        this.shop = new Shop(data.shopInfo)
        // 4. 获取商品详情信息
        this.detailInfo = data.detailInfo
        // 5. 获取商品简介信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
        // 5. 获取商品评论信息
        if(data.rate.cRate !== 0){
          this.commentInfo = data.rate.list[0]
        }
        this.$refs.scroll.refresh();
      })
      // 请求推荐数据
      getRecommend().then(res => {
        this.recommends = res.data.list
      })
      //数据读取完毕后回调,可以处理一些异步请求后的操作
      /*this.$nextTick(() => {
      })*/
      //增加防抖操作
      this.getThemeTopY =  debounce(() => {
        this.themeTops = []
        this.themeTops.push(0)
        this.themeTops.push(this.$refs.param.$el.offsetTop-44)
        this.themeTops.push(this.$refs.comment.$el.offsetTop-44)
        this.themeTops.push(this.$refs.recommend.$el.offsetTop-44)
        console.log(this.themeTops)
      },100)
    },
    updated() {
      // 获取需要的四个offsetTop
      /*this.themeTops = []
      this.themeTops.push(0)
      this.themeTops.push(this.$refs.param.$el.offsetTop)
      this.themeTops.push(this.$refs.comment.$el.offsetTop)
      this.themeTops.push(this.$refs.recommend.$el.offsetTop)*/
    },
    mounted() {

    },
    destroyed() {
      //this.$bus.$off('itemImgLoaded', this.itemImgListener)
    },
    methods: {
      imageLoad() {
        this.$refs.scroll.refresh();
        //在这里实现也是可以的
        this.getThemeTopY()
      },
      detailTitleClick(index) {
        this.$refs.scroll.scrollTo(0, -this.themeTops[index], 500)
      },
      contentScroll(position) {
        // 1.监听backTop的显示
        this.showBackTop = position.y < -BACKTOP_DISTANCE
        // 2.监听滚动到哪一个主题
        const positionY = -position.y
        let length = this.themeTops.length
        //console.log(positionY)
        if(positionY>0 && positionY < this.themeTops[1]) {
          this.currentIndex = 0;
        }else if(positionY>= this.themeTops[1] && positionY < this.themeTops[2]) {
          this.currentIndex = 1;
        }else if(positionY>= this.themeTops[2] && positionY < this.themeTops[3]) {
          this.currentIndex = 2;
        }else if(positionY > this.themeTops[3]){
          this.currentIndex = 3;
        }
        this.$refs.detailnav.currentIndex = this.currentIndex
      },
      backClick() {
        this.$refs.scroll.scrollTo(0, 0, 500)
      },
      addToCart() {
        // 1. 获取购物车需展示的信息
        const product = {}
        product.image = this.topImages[0]
        product.title = this.goods.title
        product.desc = this.goods.desc
        product.price = this.goods.realPrice
        product.iid = this.iid

        //this.$store.commit('addProductToCart',product)
        this.$store.dispatch('addProductToCart',product).then( res => {
          /*this.toastMessage = res
          this.toastShow = true

          setTimeout(() => {
            this.toastShow = false
            this.toastMessage = ""
          }, 1500)*/
          this.$toast.show(res, 1500)
        })
      }
    }
  }
</script>

<style scoped>
  #goodsDetail {
    height: 100vh;
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    background-color: #fff;
    overflow: hidden;
    height: calc(100% - 44px - 49px);
  }
</style>
