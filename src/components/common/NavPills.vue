<template>
  <ul class="nav nav-pills nav-fill fixed-bottom">
    <router-link
      :to="'/cp/panel'"
      tag="li"
      class="nav-item py-3 col-3"
      active-class="active">
      <i class="fa fa-fw fa-play-circle"></i>
    </router-link>
    <router-link
      :to="'/cp/results'"
      tag="li"
      class="nav-item py-3 col-3"
      active-class="active">
      <i class="fa fa-fw fa-gift"></i>
    </router-link>
    <router-link
      :to="'/cp/settings'"
      tag="li"
      class="nav-item py-3 col-3"
      active-class="active">
      <i class="fa fa-fw fa-gear"></i>
    </router-link>
    <li
      @click="logout"
      class="nav-item py-3 col-3"
      active-class="active">
      <i class="fa fa-fw fa-sign-out"></i>
    </li>
  </ul>
</template>

<script>
import {controlPanelsRef} from '../../firebase'

export default {
  data () {
    return {
      controlPanelKey: ''
    }
  },
  firebase: {
    controlPanels: controlPanelsRef
  },
  methods: {
    logout () {
      let vm = this
      if (vm.controlPanelKey !== '') {
        controlPanelsRef.child(vm.controlPanelKey).remove()
      }
      vm.$router.push('/cp/login')
    }
  }
}
</script>
<style>
.nav-pills .nav-item {
  background-color: #EEE;
  color: black;
}
.nav-pills {
  margin-top: 55px;
}
/*.nav-pills .nav-item a {*/
  /*color: darkgray;*/
/*}*/
/*.nav-pills .nav-item a:hover {*/
  /*text-decoration: none;*/
/*}*/
.nav-pills .nav-item:hover {
  background-color: #DDDDDD;
  cursor: pointer;
}
.nav-pills .nav-item.active {
  background-color: darkgray;
  color: white;
}
/*.nav-pills .nav-item.active a {*/
  /*color: black;*/
/*}*/
</style>
