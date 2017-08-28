<template lang="html">
    <div class="net-item" v-show="isShow" >
        <el-tabs v-model="activeTabs" type="card">
            <el-tab-pane name="close" disabled>
                <span slot="label" class="close-sp"><i class="el-icon-circle-close" @click.stop="close"></i></span>
            </el-tab-pane>
            <el-tab-pane label="Headers" name="request">
                <div class="net-item_bd">
                    <el-collapse v-model="activeCollapse">
                      <el-collapse-item title="General" name="1">
                          <el-form>
                              <el-form-item label="Request URL">
                                  {{item.url}}
                              </el-form-item>
                              <el-form-item label="Request Method">
                                  {{item.method}}
                              </el-form-item>
                              <el-form-item label="Status Code">
                                  {{item.statusCode}}
                              </el-form-item>
                              <el-form-item label="Host">
                                  {{item.host}}
                              </el-form-item>
                          </el-form>
                      </el-collapse-item>
                      <el-collapse-item title="Response Headers" name="2">
                          <el-form>
                              <template v-for="(value, key) in item.resHeader">
                                  <el-form-item :label="key">
                                      {{value}}
                                  </el-form-item>
                              </template>
                          </el-form>
                      </el-collapse-item>
                      <el-collapse-item title="Request Headers" name="3">
                          <el-form>
                              <template v-for="(value, key) in item.reqHeader">
                                  <el-form-item :label="key">
                                      {{value}}
                                  </el-form-item>
                              </template>
                          </el-form>
                      </el-collapse-item>
                      <el-collapse-item title="Request Body" name="4">
                          {{item.reqBody}}
                      </el-collapse-item>
                    </el-collapse>
                </div>
            </el-tab-pane>
            <el-tab-pane label="Response" name="response">
                <div v-if="resBody">
                    <pre>
                        <code>{{resBody}}</code>
                    </pre>
                </div>
                <div v-else>
                    <a :href="resDownload.ref">{{resDownload.fileName}}</a>
                </div>
            </el-tab-pane>
        </el-tabs>

    </div>
</template>

<script>
// import highlight from '../../../directives/highlight'
export default {
    name: 'net-list-item',
    props: ['item', 'isShow', 'resBody', 'resDownload'],
    data() {
        return {
            activeTabs: 'request',
            activeCollapse: ['1','2','3', '4']
        }
    },
    methods: {
        close() {
            this.$emit('close');
        }
    }
}
</script>

<style lang="css">
.net-item {
    position: absolute;
    width: 50%;
    height: calc(100vh - 62px);
    top: 60px;
    bottom: 0;
    right: 0;
    background: #fff;
    text-align: left;
    z-index: 99;
    border: 1px solid #eee;
    overflow: auto;
}
pre {
    overflow: auto;
}
.el-collapse-item__header {
    font-weight: bold;
}
.el-form-item {
    margin-bottom: 0;
}
.el-form-item__label {
    font-weight: bold;
}
.close-sp:hover{
    color: #1f2d3d;
    cursor: pointer;
}
</style>
