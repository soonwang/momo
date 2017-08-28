<template>
<div class="mo-header">
  <el-menu theme="dark" :default-active="activeIndex" mode="horizontal" @select="handleSelect">
    <el-menu-item index="1">All</el-menu-item>
    <el-menu-item index="2">XHR</el-menu-item>
    <el-menu-item index="3">JS</el-menu-item>
    <el-menu-item index="4">CSS</el-menu-item>
    <el-menu-item index="5">Img</el-menu-item>
  </el-menu>
  <div class="mo-tools">
      <el-tooltip effect="dark" content="Clear" placement="bottom">
          <i class="el-icon-delete" @click="clear"></i>
      </el-tooltip>
  </div>
</div>
</template>

<script>
import {mapActions} from 'vuex';
export default {
  name: 'mo-header',
  data() {
    return {
        activeIndex: '1'
    }
  },
  methods: {
      ...mapActions([
          'cleanNetList'
      ]),
      handleSelect(key, keyPath) {
          console.log(key, keyPath)
      },
      clear() {
          this.cleanNetList();
          this.$ws.send({type: 'cleanBody'});
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mo-header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 60px;
    background-color: #324157;
}
.mo-tools {
    padding-right: 20px;
    line-height: 60px;
    color: rgb(191, 203, 217);
}
</style>
