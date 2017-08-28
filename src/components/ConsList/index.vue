<template lang="html">
    <div class="m-cons-list">
        <template v-for="item in ConsList">
            <cons-list-item :item="item"></cons-list-item>
        </template>
    </div>
</template>
<script>
import ConsListItem from './ConsListItem/index.vue'
import { mapGetters } from 'vuex'
export default {
    name: 'cons-list',
    components: {
        ConsListItem: ConsListItem
    },
    data() {
        return {}
    },
    computed: {
        ...mapGetters([
            'ConsList'
        ])
    },
    methods: {

    }
}
</script>

<style lang="css">
</style>
