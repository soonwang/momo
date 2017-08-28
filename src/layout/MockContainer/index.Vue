<template>
  <div class="mo-wrap">
      <mo-header></mo-header>
      <div class="mo-content">
          <mock-list></mock-list>
      </div>
  </div>
</template>

<script>
import MoHeader from './header/index';
import MockList from '../../components/MockList/index';
export default {
  name: 'mo-container',
  components: {
      MoHeader,
      MockList
  },
  data () {
    return {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mo-content {

}
</style>
