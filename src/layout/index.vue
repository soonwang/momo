<template>
  <div class="mo-layout">
      <mo-sidebar></mo-sidebar>
      <div class="mo-container">
          <router-view></router-view>
      </div>
  </div>
</template>

<script>
import MoSidebar from './sidebar/index.vue'
export default {
  name: 'layout',
  components: {
      MoSidebar: MoSidebar
  },
  data () {
    return {
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.mo-container {
    padding-left: 120px;
}
.mo-content {
    padding: 10px;
    height: calc(100vh - 80px);
    overflow: auto;
}
.el-icon-delete:hover {
    cursor: pointer;
}
</style>
