<template lang="html">
    <div class="m-cons-list-item" >
        <div class="item-extra">
            <div class="item-env">
                {{item.env.os.name}} {{item.env.browser.name}}
                <span class="item-type" :class="{error: item.level === 'error'}">[{{item.level}}]</span>
            </div>
            <div class="item-caller">
                {{item.caller && item.caller.file + ': ' }} {{item.caller && item.caller.line}}
            </div>
        </div>
        <div class="item-data">
            <pre>{{formatify(item.args[0])}}</pre>
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
    methods: {
        formatifyStr(str) {
            try {
                var returnObj = JSON.parse(str);
                return this.formatify(returnObj);
            } catch(e) {
                return str;
            }
        },
        formatifyObj(obj) {
            for(let item in obj) {
                if(obj.hasOwnProperty(item)) {
                    obj[item] = this.formatify(obj[item]);
                }
            }
            return obj;
        },
        formatifyArr(arr) {
            return arr.map(item => {
                return this.formatify(item);
            })
        },
        formatify(args) {
            if(Array.isArray(args)) {
                return this.formatifyArr(args);
            } else if(Object.prototype.toString.call(args) === '[object Object]') {
                return this.formatifyObj(args);
            } else if(typeof args === 'string') {
                return this.formatifyStr(args);
            } else {
                return args;
            }
        }
    }

}
</script>

<style lang="css" scoped>
.m-cons-list-item {
    min-height: 45px;
    border-bottom: 1px #eee solid;
}
.item-extra {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.item-data {
    width: 100%;
    margin-top: 5px;
    overflow: auto;
}
.item-caller {
    width: 250px;
}
.item-type {
    width: 60px;
}

.error {
    color: red;
}
</style>
