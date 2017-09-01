<template>
<div class="mo-header">
    <div class="mo-tools">
        <el-tooltip class="f-mr10" effect="dark" content="使用帮助" placement="bottom">
            <i class="el-icon-information" @click="info"></i>
        </el-tooltip>
    </div>
    <el-dialog class="tips-dialog" title="Mock" :visible.sync="isShowDialog" top="30%" size="tiny">
        <p>每组mock的key值为想要mock的url（或者包含关键字），value可以为本地文件的绝对路径，也可以是json</p>
        <p>例如</p>
        <pre>{"http://example.com": "/path/to/file"}</pre>
        <p>或者</p>
        <pre>
{
    "http://example.com": {
        "name": "XXXXX",
        "age": "XXXX"
    }
}
         </pre>
    </el-dialog>
</div>
</template>

<script>
export default {
  name: 'mo-header',
  data() {
      return {
          isShowDialog: false
      }
  },
  methods: {
      info() {
          this.isShowDialog = true;
      },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mo-header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    height: 60px;
    background-color: #324157;
}

</style>
