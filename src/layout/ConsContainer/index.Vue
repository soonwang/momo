<template>
  <div class="mo-wrap">
      <mo-header></mo-header>
      <div class="mo-content">
          <cons-list></cons-list>
      </div>
  </div>
</template>

<script>
import MoHeader from './header/index'
import ConsList from '../../components/ConsList/index.vue'

export default {
  name: 'mo-container',
  components: {
      MoHeader: MoHeader,
      ConsList: ConsList
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
