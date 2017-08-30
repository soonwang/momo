<template>
<div class="mo-header">
  <el-menu theme="dark" :default-active="activeIndex" mode="horizontal" @select="handleSelect">
    <el-menu-item index="all">All</el-menu-item>
    <el-menu-item index="xhr">XHR</el-menu-item>
    <el-menu-item index="javascript">JS</el-menu-item>
    <el-menu-item index="css">CSS</el-menu-item>
    <el-menu-item index="image">Img</el-menu-item>
    <el-menu-item index="other">Other</el-menu-item>
  </el-menu>
  <div class="mo-tools">
      <el-tooltip effect="dark" content="清空" placement="bottom">
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
        activeIndex: 'all'
    }
  },
  methods: {
      ...mapActions([
          'cleanNetList',
          'setNetType'
      ]),
      handleSelect(key, keyPath) {
          this.setNetType({type: key});
      },
      clear() {
          this.cleanNetList();
          this.$http.get('/api/cleanNet').then(res => {
              console.log(res);
          })
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
