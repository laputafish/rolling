<template>
  <div id="controlPanel">
    <my-navbar></my-navbar>
    <router-view></router-link>
    </router-view>
  </div>
</template>

<script>
  import Navbar from '../components/common/Navbar.vue'
  export default {
    components: {
      myNavbar: Navbar
    },

    data () {
      return {}
    }
  }
</script>

<style>

</style>
