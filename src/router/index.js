import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout/index'
import NetContainer from '@/layout/NetContainer/index'
import MockContainer from '@/layout/MockContainer/index'
import ConsContainer from '@/layout/ConsContainer/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
          {
              path: '',
              component: NetContainer,
          },
          {
              path: 'network',
              component: NetContainer,
          },
          {
              path: 'mock',
              component: MockContainer,
          },
          {
              path: 'console',
              component: ConsContainer,
          }
      ]
    }
  ]
})
