<template>
  <div class="recommed">
    <div v-for="item in recommends" class="recommed-item">
      <a :href="item.link">
        <img :src="item.image">
        <div>{{item.title}}</div>
      </a>
    </div>
  </div>
</template>

<script>
    export default {
      name: "RecommendView",
      props: {
        recommends: {
          type: Array,
          default() {
            return []
          }
        }
      }
    }
</script>

<style scoped>
  .recommed {
    display: flex;
    width: 100%;
    text-align: center;
    font-size: 14px;
    padding: 10px 0 20px 0;
    border-bottom: 10px solid #eee;
  }
  .recommed-item {
    flex: 1;
  }
  .recommed-item img {
    width: 70px;
    height: 70px;
    margin-bottom: 10px;
  }

</style>
