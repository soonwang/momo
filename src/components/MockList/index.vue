<template lang="html">
    <el-row :gutter="10">
        <el-col :span="5">
            <div class="rule-list">
                <template v-for="(item, index) in rule">
                    <div class="rule-list-item" @click="onItemClick(item.rules, index)">
                        <div class="rule-switch">
                            <el-switch v-model="item.isActive" on-text="" off-text=""></el-switch>
                            {{item.name}}
                        </div>
                        <div class="rule-op">
                            <i class="el-icon-edit" @click.stop="onClickEdit(index, item.name)"></i>
                            <i class="el-icon-delete" @click.stop="onClickDelete(index, item.name)"></i>
                        </div>
                    </div>
                </template>
                <div class="rule-list-bm">
                    <i class="el-icon-plus" @click.stop="onClickAdd"></i>
                    <i class="el-icon-delete" @click.stop="onClickDeleteAll"></i>
                </div>
            </div>
        </el-col>
        <el-col :span="19">
            <vue-json-editor v-model="activeRule" :showBtns="true" @json-save="onSave" @json-change="onJsonChange"></vue-json-editor>
        </el-col>
    </el-row>
</template>

<script>
import vueJsonEditor from 'vue-json-editor';
import {mapGetters} from 'vuex';

export default {
    name: 'mock-list',
    components: {
        vueJsonEditor
    },
    computed: {
        ...mapGetters([
            'MockList'
        ]),
    },
    data() {
        return {
            activeRule: {},
            activeIndex: 0,
            rule: {}
        }
    },
    beforeMount(){
        this.rule = JSON.parse(JSON.stringify(this.MockList));
        this.activeRule = this.rule[0] && this.rule[0].rules || {};
    },
    methods: {
        onItemClick(rules, index) {
            this.activeRule = rules;
            this.activeIndex = index;
        },
        onSave(value) {
            console.log(value);
            this.$ws.send({type: 'setRule', rule: this.rule})
        },
        onJsonChange(value) {
            console.log(value);
            this.rule[this.activeIndex].rules = value;
        },
        onClickAdd(){
            this.$prompt('请输入新规则名称', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({value}) => {
                this.rule.push({
                    name: value,
                    isActive: true,
                    rules: {}
                });
                this.activeRule = {};
                this.activeIndex = this.rule.length - 1;
            }).catch(() => {});
        },
        onClickEdit(index, name) {
            this.$prompt('请输入修改后规则名称', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({value}) => {
                this.rule[index].name = value;
            }).catch(() => {});
        },
        onClickDelete(index, name) {
            this.$confirm('确定删除当前规则？', '提示', {
                configButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.rule.splice(index, 1);
            }).catch(()=>{});
        },
        onClickDeleteAll(key) {
            this.$confirm('确定删除全部规则？', '提示', {
                configButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.rule = [];
            }).catch(()=>{});
        }
    }
}
</script>

<style lang="css">
.rule-list {
    position: relative;
    height: calc(100vh - 100px);
    padding-bottom: 20px;
    border-radius: 5px;
    background: #e5e9f2;
    overflow: auto;
}
.rule-list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #d3dce6;
}
.rule-list-item:hover {
    background-color: #d3dce6;
    cursor: pointer;
}
.rule-op {
    width: 50px;
}
.rule-list-bm {
    position: absolute;
    display: flex;
    justify-content: space-between;
    align-items: center;
    bottom: 0;
    width: 100%;
    height: 28px;
    padding: 0 20px;
    box-sizing: border-box;
    background: #d3dce6;
}
.el-icon-plus:hover {
    cursor: pointer;
}
.json-save-btn:hover {
    cursor: pointer;
}
.jsoneditor-vue .jsoneditor-outer {
    height: calc(100vh - 160px);
}
</style>
