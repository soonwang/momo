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
</div>
</template>

<script>
export default {
  name: 'mo-sidebar',
  data() {
    return {

    }
  },
  methods: {
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
</style>
