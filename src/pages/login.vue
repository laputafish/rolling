<template>
<section class="login-block">
  <div class="container">
    <vue-toastr
      ref="toastr"
      click-close="true"></vue-toastr>
    <div class="row">
      <div class="col-md-4 login-sec">
        <h2 class="text-center">Login Now</h2>
        <form class="login-form" @submit.prevent="login">
          <div class="form-group">
            <label for="exampleInputEmail1" class="text-uppercase">Username</label>
            <input type="text" class="form-control" placeholder="" v-model="user.userId">
          </div>
          <div class="form-group">
            <label for="exampleInputPassword1" class="text-uppercase">Password</label>
            <input type="password" class="form-control" placeholder="" v-model="user.password">
          </div>
          <div class="form-check">
            <!-- <label class="form-check-label">
              <input type="checkbox" class="form-check-input" v-model="user.rememberMe">
              <small>Remember Me</small>
            </label> -->
            <button type="submit" class="btn btn-primary float-right">Submit</button>
          </div>
        </form>
      </div>
      <div class="col-md-8 banner-sec">
        <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
          <ol class="carousel-indicators">
            <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
            <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
            <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
          </ol>
          <div class="carousel-inner" role="listbox">
            <div class="carousel-item active">
              <img class="d-block img-fluid" src="/static/img/banners/banner1.jpg" alt="First slide">
              <div class="carousel-caption d-none d-md-block" v-if="showCarouselCaption">
                <div class="banner-text">
                  <h2>This is Heaven</h2>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation</p>
                </div>
              </div>
            </div>
            <div class="carousel-item">
              <img class="d-block img-fluid" src="/static/img/banners/banner2.jpg" alt="First slide">
              <div class="carousel-caption d-none d-md-block" v-if="showCarouselCaption">
                <div class="banner-text">
                  <h2>This is Heaven</h2>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation</p>
                </div>
              </div>
            </div>
            <div class="carousel-item">
              <img class="d-block img-fluid" src="/static/img/banners/banner3.jpg" alt="First slide">
              <div class="carousel-caption d-none d-md-block" v-if="showCarouselCaption">
                <div class="banner-text">
                  <h2>This is Heaven</h2>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
</template>

<script>
import {validateUser, controlPanelsRef} from '../firebase'
import {getCurrDateTime} from '../helpers/util.js'

export default {
  data () {
    return {
      user: {
        userId: '',
        password: '',
        rememberMe: false
      },
      showCarouselCaption: false
    }
  },
  name: 'Login',
  methods: {
    login () {
      console.log('login')
      let vm = this
      validateUser(vm.user, (passed) => {
        console.log('passed: ', (passed ? 'true' : 'false'))
        if (passed) {
          controlPanelsRef.remove()
          let ref = controlPanelsRef.push({
            login_at: getCurrDateTime()
          })
          vm.setPanelKey(ref.key)
          vm.$router.push({name: 'Panel'})
        } else {
          vm.$toastr.e('Login fails!')
        }
      })
    },
    setPanelKey (key) {
      console.log('updatePanelKey key = ', key)
      this.$store.commit('updatePanelKey', key)
    }
  },
  mounted () {

  }
}
</script>

<style scoped>

.login-block {
  /* background: #DE6262; */
  /* fallback for old browsers */
  /* background: -webkit-linear-gradient(to bottom, #FFB88C, #DE6262); */
  /* Chrome 10-25, Safari 5.1-6 */
  /* background: linear-gradient(to bottom, #FFB88C, #DE6262); */
  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  background: #DDD;
  /* fallback for old browsers */
  float: left;
  width: 100%;
  padding:10px;
}

.carousel-inner {
  border-radius: 0 0 10px 10px;
  height: 100%;
}

.banner-sec {
  background: url(/static/img/banners/banner1.jpg) no-repeat left bottom;
  background-size: cover;
  min-height: 200px;
  border-radius: 0 0 10px 10px;
  padding: 0;
}

@media(min-width: 480px) {
  .login-block {
    background: -webkit-linear-gradient(to bottom, #CCC, #222);
    /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to bottom, #CCC, #222);
    /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    padding: 50px 0;
  }
  .banner-sec {
    border-radius: 0 10px 10px 0;
  }

  .carousel-inner {
    border-radius: 0 10px 10px 0;
  }
}


/*@media(min-width: 480px) {*/
  /*min-height: 500px;*/
/*}*/
.container {
  background: #fff;
  border-radius: 10px;
  box-shadow: 3px 3px 0px rgba(0, 0, 0, 0.5);
}

.carousel-caption {
  position: relative;
  top: 0;
  color: rgba(0,0,0,.5);
  text-align: left;
  left: 5%;
}

.carousel {
  height: 100%;
}

.carousel-item {
  height: 100%;
}

.carousel-item img {
  width: 100%;
  height: 100%;
  position: absolute;
  object-fit: cover;
}

.login-sec {
  padding: 10px 30px 20px 30px;
  position: relative;
}

@media(min-width: 480px) {
  .login-sec {
    padding: 50px 30px;
  }
}

.login-sec .copy-text {
  position: absolute;
  width: 80%;
  bottom: 20px;
  font-size: 13px;
  text-align: center;
}

.login-sec .copy-text i {
  color: #FEB58A;
}

.login-sec .copy-text a {
  /* color: #E36262; */
  color: #007bff;
}

.login-sec h2 {
  margin-bottom: 30px;
  font-weight: 800;
  font-size: 30px;
  /* color: #DE6262; */
  color: #007bff;
}

.login-sec h2:after {
  content: " ";
  width: 100px;
  height: 5px;
  /* background: #FEB58A; */
  background: #007bff;
  display: block;
  margin-top: 20px;
  border-radius: 3px;
  margin-left: auto;
  margin-right: auto
}

.btn-login {
  /* background: #DE6262; */
  color: #fff;
  font-weight: 600;
}

.banner-text {
  color: rgba(0,0,0,.5);
  width: 70%;
  position: absolute;
  padding-left: 20px;
}

.banner-text h2 {
  color: rgba(0,0,0,.8);
  font-weight: 600;
}

.banner-text p {
  color: rgba(0,0,0,.8);
}
.banner-text h2:after {
  content: " ";
  width: 100px;
  height: 5px;
  background: rgba(0,0,0,.8);
  display: block;
  margin-top: 20px;
  border-radius: 3px;
}

</style>
