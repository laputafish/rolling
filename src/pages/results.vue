<template>
  <div>
    <my-header @commandHandler="processCommand"></my-header>
    <div class="container" style="margin-bottom:50px; margin-top:80px;">
      <div class="row">
        <div class="col-sm-10 col-md-8 col-lg-6 mx-auto">
          <ul class="list-group">
            <li class="list-group-item" v-for="(item,index) in drawnNumbers">
              <div class="row">
              <div class="col-sm-1 my-auto">{{ index + 1 }}</div>
              <div class="col-sm-6">
                <h2><span class="drawn-number badge badge-lg badge-primary">{{ item.number }}</span></h2>
              </div>
            </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from './results/header'
import {drawnNumbersRef} from '../firebase'

export default {
  methods: {
    resetNumbers () {
      alert('resetNumbers')
    },
    processCommand (params) {
      let vm = this
      switch (params.command) {
        case 'reset':
          vm.resetNumbers()
      }
    }
  },
  components: {
    myHeader: Header
  },
  data () {
    return {

    }
  },
  firebase: {
    drawnNumbers: drawnNumbersRef
  },
  mounted: () => {

  }
}
</script>

<style>
.drawn-number {
  min-width: 60px;
}
</style>
