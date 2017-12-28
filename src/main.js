// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './firebase'
import Vue from 'vue'
import VueFire from 'vuefire'
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm'
import App from './App'
import router from './router'
import Toastr from 'vue-toastr'
import VueResource from 'vue-resource'
// import jQuery from 'jquery'
//
import 'font-awesome/scss/font-awesome.scss'
import 'simple-line-icons/scss/simple-line-icons.scss'
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'

import 'bootstrap'

import('vue-toastr/src/vue-toastr.scss')

// window.jQuery = jQuery
// window.$ = jQuery

Vue.component('vue-toastr', Toastr)

Vue.use(Toastr)
Vue.use(BootstrapVue)
Vue.use(VueFire)
// Vue.use(require('vue-pusher'), {
//   api_key: '4927417ec00dc0b32868',
//   options: {
//     cluster: 'ap1',
//     encrypted: true
//   }
// })
Vue.use(VueResource)
Vue.config.productionTip = false

global.jQuery = require('jquery')
let $ = global.jQuery
window.$ = $
window.Vue = Vue

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
