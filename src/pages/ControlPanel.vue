<template>
  <div id="controlPanel">
    <my-nav-pills v-if="$route.path!='/cp/login'"></my-nav-pills>
    <router-view></router-view>
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
    },
    mounted () {
      console.log('route: ' + this.$route.path)
    }
  }
</script>

<style>

</style>
