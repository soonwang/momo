<template>
<div class="mo-header">
  <div class="mo-input-code">
      <input v-model="input" class="input-code" placeholder=">输入可执行js代码" @keyup.enter="execute">
  </div>
  <div class="mo-tools">
      <el-tooltip class="f-mr10" effect="dark" content="使用帮助" placement="bottom">
          <i class="el-icon-information" @click="info"></i>
      </el-tooltip>
      <el-tooltip effect="dark" content="清空" placement="bottom">
          <i class="el-icon-delete" @click="clear"></i>
      </el-tooltip>
  </div>
  <el-dialog class="tips-dialog" title="Console" :visible.sync="isShowDialog" top="30%" size="tiny">
      <p>1.在url后添加参数</p>
      <pre>?ws_console=true</pre>
      <p>例如：</p>
      <pre>http://www.kaola.com?ws_console=true</pre>
      <p>2.在页面中自行引入脚本</p>
      <pre>//{{ServerInfo.ip}}:{{ServerInfo.webPort}}/ws_console.js</pre>
  </el-dialog>
</div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'

export default {
  name: 'mo-header',
  data() {
    return {
        isShowDialog: false,
        input: ''
    }
  },
  computed: {
      ...mapGetters(['ServerInfo'])
  },
  methods: {
      ...mapActions([
          'cleanConsList'
      ]),
      clear() {
          this.cleanConsList();
      },
      info() {
          this.isShowDialog = true;
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
<style>
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
/*.tips-dialog .el-dialog__header {
    padding: 10px 10px 0;
}*/
.tips-dialog pre {
    background: #eee;
    padding: 5px;
    border-radius: 8px;
}
.f-mr10 {
    margin-right: 10px;
}
</style>
