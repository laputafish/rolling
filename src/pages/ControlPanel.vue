<template>
  <div id="controlPanel">
    <my-nav-pills v-if="$route.path!='/cp/login'"></my-nav-pills>
    <router-view></router-view>
  </div>
</template>

<script>
  import Navbar from '../components/common/Navbar.vue'
  import NavPills from '../components/common/NavPills.vue'
  import {controlPanelsRef} from '../firebase'

  export default {
    components: {
      myNavbar: Navbar,
      myNavPills: NavPills
    },

    data () {
      return {}
    },
    mounted () {
      let vm = this
      console.log('call controlPanelsRef.on(child_removed)')
      controlPanelsRef.on('child_removed', (snapshot) => {
        // let panel = snapshot.val()
        let panelKey = snapshot.key
        console.log('Controlpanel.vue on(child_removed) :: panelKey = ' + panelKey)
        if (panelKey === vm.$store.state.panelKey) {
          vm.$toastr.e('Another control panel is opened.')
          vm.$router.push('/cp/login')
        }
      })
    }
  }
</script>

<style>

</style>
