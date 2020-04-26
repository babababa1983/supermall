<template>
  <div id="goodsDetail">
    <detail-nav-bar class="detail-nav"/>
    <scroll class="content" ref="scroll" @scroll="contentScroll"
            :data="[topImages, goods, shop, detailInfo, paramInfo]"
            :probe-type="3">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info :paramInfo="paramInfo" />
    </scroll>

    <back-top @click.native="backClick" v-show="showBackTop">
      <img src="~assets/img/common/top.png" alt="">
    </back-top>
  </div>
</template>

<script>
  import DetailNavBar from './DetailNavBar'
  import DetailSwiper from "./DetailSwiper";
  import DetailBaseInfo from "./DetailBaseInfo";
  import DetailShopInfo from "./DetailShopInfo";
  import DetailGoodsInfo from "./DetailGoodsInfo";
  import DetailParamInfo from "./DetailParamInfo";


  import {BACKTOP_DISTANCE} from "@/common/const";

  import Scroll from "components/common/scroll/Scroll";
  import BackTop from 'components/content/backTop/BackTop'

  import {getGoodsDetailById,Goods,Shop,GoodsParam} from "network/detail";

  export default {
    name: "Detail",
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      BackTop,
      Scroll
    },
    data() {
      return {
        iid: 0,
        showBackTop: false,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        themeTops: []
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

        this.$refs.scroll.refresh();
      })
    },
    methods: {
      imageLoad() {
        this.$refs.scroll.refresh();
      },
      contentScroll(position) {
        // 1.监听backTop的显示
        this.showBackTop = position.y < -BACKTOP_DISTANCE

        // 2.监听滚动到哪一个主题
        this._listenScrollTheme(-position.y)
      },
      _listenScrollTheme(position) {
        let length = this.themeTops.length;
        for (let i = 0; i < length; i++) {
          let iPos = this.themeTops[i];
          /**
           * 判断的方案:
           *  方案一:
           *    条件: (i < (length-1) && currentPos >= iPos && currentPos < this.themeTops[i+1]) || (i === (length-1) && currentPos >= iPos),
           *    优点: 不需要引入其他的内容, 通过逻辑解决
           *    缺点: 判断条件过长, 并且不容易理解
           *  方案二:
           *    条件: 给themeTops最后添加一个很大的值, 用于和最后一个主题的top进行比较.
           *    优点: 简洁明了, 便于理解
           *    缺点: 需要引入一个较大的int数字
           * 疑惑: 在第一个判断中, 为什么不能直接判断(currentPos >= iPos)即可?
           * 解答: 比如在某一个currentPos大于第0个时, 就会break, 不会判断后面的i了.
           */
          if (position >= iPos && position < this.themeTops[i+1]) {
            if (this.currentIndex !== i) {
              this.currentIndex = i;
            }
            break;
          }
        }
      },
      backClick() {
        this.$refs.scroll.scrollTo(0, 0, 500)
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
    height: calc(100% - 44px);
  }
</style>
