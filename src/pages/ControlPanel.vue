<template>
  <div id="controlPanel">
    <div class="backdrop"></div>
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
#controlPanel {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: aboslute;
}

  #controlPanel .backdrop {
    width: 100%;
    height: 100%;
    z-index: -1;
    top: 0;
    left: 0;
    position: fixed;
    background-image: url(/static/img/mobile_bkgd.jpg);
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    opacity: 0.8;
  }

 .bg-gold-dark {
   background-color: #111;
   opacity: 1;
 }
</style>
