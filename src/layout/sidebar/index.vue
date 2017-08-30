<template>
<div class="mo-sidebar">
  <h1 class="mo-logo">
        <img class="mo-logo_img" src="./../../assets/logo.png" alt="logo">
    </h1>
  <el-menu default-active="1" theme="dark">
    <router-link to="network">
        <el-menu-item index="1">NetWork</el-menu-item>
    </router-link>
    <router-link to="mock">
        <el-menu-item index="2">Mock</el-menu-item>
    </router-link>
    <router-link to="console">
        <el-menu-item index="3">Console</el-menu-item>
    </router-link>
  </el-menu>
  <div class="mo-sidebar_btm">
      <i class="el-icon-setting" @click="showDialog"></i><br>
      {{hostname}}
  </div>
  <el-dialog class="dialog" :visible.sync="isShowDialog" top="30%" size="tiny">
      <div class="" v-html="qrcode"></div>
      <div class="">
          https需要安装证书！
      </div>
  </el-dialog>
</div>
</template>

<script>
import {mapActions} from 'vuex';

export default {
  name: 'mo-sidebar',
  data() {
    return {
        hostname: '127.0.0.1:8001',
        qrcode: '',
        isShowDialog: false,
    }
  },
  mounted() {
      this.$http.get('/api/init').then(res => {
          if(res.status !== 200) return;
          this.hostname = res.data.ip + ':' + res.data.proxyPort;
          this.qrcode = res.data.qrImgDom;
          this.setServerInfo(res.data);
      })
  },
  methods: {
      ...mapActions(['setServerInfo']),
      showDialog() {
          this.isShowDialog = true;
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.mo-sidebar {
  position: absolute;
  display: inline-block;
  width: 120px;
  height: 100vh;
  text-align: center;
  background-color: #324157;
}
.mo-sidebar a {
    text-decoration: none;
}
.mo-logo {
    width: 120px;
    height: 60px;
    text-align: center;
}
.mo-logo_img {
    padding: 10px;
    height: 40px;
}
.mo-sidebar_btm {
    position: absolute;
    width: 120px;
    bottom: 50px;
    font-size: 12px;
    color: #bfcbd9;
}
.el-icon-setting {
    margin-bottom: 10px;
    font-size: 25px;
}
.el-icon-setting:hover {
    cursor: pointer;
}
.dialog .el-dialog__header {
    padding: 10px 10px 0;
}
.dialog .el-dialog--tiny{
    width: 250px;
}
</style>
