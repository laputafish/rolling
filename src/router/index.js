import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/pages/home'
import Blank from '@/pages/blank'
import Login from '@/pages/login'
import Register from '@/pages/register'

import jQuery from 'jquery'
window.jQuery = jQuery
window.$ = jQuery

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/home',
      name: 'Blank',
      component: Blank,
      children: [
        {
          path: '/home',
          name: 'Home',
          component: Home
        },
        {
          path: 'auth',
          name: 'Auth',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'login',
              name: 'Login',
              component: Login
            },
            {
              path: 'register',
              name: 'Register',
              component: Register
            }
          ]
        }
      ]
    }
  ]
})
