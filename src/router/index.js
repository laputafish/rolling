import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/pages/home'
import Blank from '@/pages/blank'
// import Login from '@/pages/login'
// import Register from '@/pages/register'
import ControlPanel from '@/pages/ControlPanel'
import Results from '@/pages/Results'
import Settings from '@/pages/Settings'
import Panel from '@/pages/Panel'

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
        }
        // ,
        // {
        //   path: 'auth',
        //   name: 'Auth',
        //   component: {
        //     render (c) { return c('router-view') }
        //   },
        //   children: [
        //     {
        //       path: 'login',
        //       name: 'Login',
        //       component: Login
        //     },
        //     {
        //       path: 'register',
        //       name: 'Register',
        //       component: Register
        //     }
        //   ]
        // }
      ]
    },
    {
      path: '/cp',
      name: 'ControlPanel',
      component: ControlPanel,
      children: [
        // {
        //   path: 'results',
        //
        //   name: 'Results',
        //   component: Results
        // },
        {
          path: 'settings',
          name: 'Settings',
          component: Settings
        },
        {
          path: 'panel',
          name: 'Panel',
          component: Panel
        }
      ]
    },
    {
      path: '/results',
      name: 'Results',
      component: Results
    }
  ]
})
