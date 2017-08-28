<template>
  <div class="mo-wrap">
      <mo-header></mo-header>
      <div class="mo-content">
          <net-list></net-list>
      </div>
  </div>
</template>

<script>
import MoHeader from './header/index'
import NetList from '../../components/NetList/index'
export default {
  name: 'mo-container',
  components: {
      MoHeader,
      NetList
  },
  data () {
    return {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
