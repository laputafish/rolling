import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/pages/home'
import Blank from '@/pages/blank'
// import Login from '@/pages/login'
// import Register from '@/pages/register'
import ControlPanel from '@/pages/ControlPanel'
import ControlPanelMain from '@/pages/ControlPanelMain'
import Results from '@/pages/Results'
import Settings from '@/pages/Settings'
import Panel from '@/pages/Panel'
import Login from '@/pages/Login'

import {store} from '../store/store'

import jQuery from 'jquery'
window.jQuery = jQuery
window.$ = jQuery

Vue.use(Router)

const router = new Router({
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
          path: '/panel',
          redirect: '/cp/panel'
        },
        {
          path: '/results',
          redirect: '/cp/results'
        },
        {
          path: '/settings',
          redirect: '/cp/settings'
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
      redirect: '/cp/panel',
      component: ControlPanel,
      children: [
        {
          path: 'login',
          name: 'Login',
          component: Login
        },
        // {
        //   path: 'results',
        //
        //   name: 'Results',
        //   component: Results
        // },
        {
          path: 'main',
          name: 'ControlPanelMain',
          component: ControlPanelMain
        },
        {
          path: 'results',
          name: 'Results',
          component: Results
        },
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
    }

  ]
})

router.beforeEach((to, from, next) => {
  console.log('beforeEach  to: ' + to.path)
  if (to.name !== 'Login' && to.name !== 'Home') {
    console.log('beforeEach to.name = ', to.name)
    console.log('store.state:', store.state)
    if (store.state.panelKey === '') {
      next({name: 'Login'})
    }
  }
  console.log('beforeEach router :: panelKey = ' + store.state.panelKey)
  next()
})

export default router
