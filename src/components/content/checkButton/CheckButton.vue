<template>
    <div class="check-button" :class="{check: isChecked}">
      <img src="~/assets/img/cart/tick.svg" alt="">
    </div>
</template>

<script>
	export default {
		name: "CheckButton",
    props: {
		  isChecked: {
		    type: Boolean,
        default: false
      }
    }
    /*data: function () {
		  return {
        isChecked: this.isChecked
      }
    },
    methods: {
      selectItem: function () {
        this.$emit('checkBtnClick')
      }
    },
    watch: {
		  value: function (newValue) {
        this.isChecked = newValue;
      }
    }*/
	}
</script>

<style scoped>
  /*.icon-selector {
    position: relative;
    margin: 0;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid #ccc;
    cursor: pointer;
  }*/

  .check-button {
    border-radius: 50%;
    border: 2px solid #aaa;
  }

  .check {
    background-color: red;
    border-color: red;
  }
</style>
