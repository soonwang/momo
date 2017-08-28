<template lang="html">
    <div class="m-cons-list-item" :class="{error: item.type === 'error'}">
        <div class="item-data">
            <span class="item-type">[{{item.type}}]</span>
            <span>{{item.data}}</span>
        </div>
        <div class="item-env">
            {{item.env}}
        </div>
    </div>
</template>

<script>
export default {
    name: 'cons-list-item',
    props: ['item'],
    data() {
        return {

        }
    },

}
</script>

<style lang="css" scoped>
.m-cons-list-item {
    display: flex;
    min-height: 35px;
    justify-content: space-between;
    align-items: flex-end;
    border-bottom: 1px #eee solid;
}
.item-type {
    width: 60px;
}
.error {
    color: red;
}
</style>
