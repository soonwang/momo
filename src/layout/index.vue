<template>
  <div class="mo-layout">
      <mo-sidebar></mo-sidebar>
      <div class="mo-container">
          <router-view></router-view>
      </div>
  </div>
</template>

<script>
import MoSidebar from './sidebar/index.vue';
import {mapActions} from 'vuex';
export default {
  name: 'layout',
  components: {
      MoSidebar: MoSidebar
  },
  beforeMount() {
      this.$http.get('/api/latestLog').then(res => {
          if(res.status != 200) return;
          if(Array.isArray(res.data)) {
              res.data.forEach(item => this.addNetItem({item}));
          }
      });
      this.$http.get('/api/getRule').then(res => {
          if(res.status != 200) return;
          this.setMockList({data: res.data});
      })
  },
  methods: {
      ...mapActions([
          'addNetItem',
          'setMockList'
      ]),
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
