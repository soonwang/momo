<template lang="html">
    <div class="" ref="J_editor">
        <vue-json-editor v-model="json" :showBtns="true" @json-change="onJsonChange"></vue-json-editor>
    </div>
</template>

<script>
import vueJsonEditor from 'vue-json-editor'
export default {
    name: 'mock-list-item',
    props: ['rules'],
    components: {
        vueJsonEditor
    },
    data() {
        return {
            json: {}
        }
    },
    mounted() {
        this.json = JSON.parse(JSON.stringify(this.rules))
    },
    methods: {
        onJsonChange(value) {
            console.log(value);
        }
    }
}
</script>

<style lang="css">
</style>
