<template>
  <div id="controlPanel">
    <my-nav-pills></my-nav-pills>
    <router-view></router-link>
    </router-view>
  </div>
</template>

<script>
  import Navbar from '../components/common/Navbar.vue'
  import NavPills from '../components/common/NavPills.vue'
  
  export default {
    components: {
      myNavbar: Navbar,
      myNavPills: NavPills
    },

    data () {
      return {}
    }
  }
</script>

<style>

</style>
