<template>
<div class="mo-header">
  <div class="mo-input-code">
      <input v-model="input" class="input-code" placeholder=">输入可执行js代码" @keyup.enter="execute">
  </div>
  <div class="mo-tools">
      <el-tooltip effect="dark" content="Clear" placement="bottom">
          <i class="el-icon-delete" @click="clear"></i>
      </el-tooltip>
  </div>
</div>
</template>

<script>
import {mapActions} from 'vuex'

export default {
  name: 'mo-header',
  data() {
    return {
        input: ''
    }
  },
  methods: {
      ...mapActions([
          'cleanConsList'
      ]),
      clear() {
          this.cleanConsList();
      },
      execute() {
          this.$ws.send({
              type: 'exec',
              data: this.input
          });
          this.input = '';
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
.mo-input-code {
    line-height: 60px;
    width: calc(100% - 100px);
    overflow: hidden;
}
.input-code {
    border: 0;
    width: calc(100% - 30px);
    height: 40px;
    padding-left: 8px;
    color: #fff;
    font-size: 14px;
    background: #324157;
}
.mo-tools {
    padding-right: 20px;
    line-height: 60px;
    color: rgb(191, 203, 217);
}
</style>
