<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-12">
        <button type="button" @click="draw" class="py-5 btn btn-primary btn-large btn-block">
          Draw
        </button>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12">
        <div class="progress">
          <div class="progress-bar bg-warning"
               :style="progressStyle"
               role="progressbar"
               :aria-valuenow="value"
               :aria-valuemin="min"
               :aria-valuemax="max"></div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12">
        <ul class="list-group">
          <li class="list-group-item" v-for="number in drawnNumbers">{{ number }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import {db, settingsRef, actionsRef} from '../firebase'
//  let Pusher = require('pusher-js')

  export default {
    data () {
      return {
        settings: {
          duration: 3
        },
        value: 0,
        min: 0,
        max: 30,
        drawnNumbers: [],
        actions: [],
        dbSettings: []
      }
    },
    firebase: {
      dbSettings: settingsRef,
      actions: actionsRef
    },
    mounted () {
      let vm = this
      db.ref('settings').once('value', function () {
        for (var key in vm.dbSettings) {
          vm.settings.duration = vm.dbSettings[key].duration
        }
      })
      db.ref('actions').once('value', function () {
        console.log('actionsRef:', vm.actionsRef)
      })
    },
    methods: {
      draw () {
        let vm = this
        vm.value = 0
//        Pusher.trigger('lottery', 'draw', {duration: 3})
        let intervalId = setInterval(() => {
          vm.value++
          if (vm.value >= vm.max) {
            clearInterval(intervalId)
          }
        }, 100)
        // send push
      }
    },
    watch: {
      actions: {
        deep: true,
        handler (newArray) {
          console.log('actionsRef :: value: ', newArray)
          alert('actions')
        }
      }
    },
    computed: {
      progressStyle () {
        let vm = this
        let widthPercent = Math.floor(vm.value * 100 / vm.max)
        console.log('value=' + vm.value + ', min=' + vm.min + ', max=' + vm.max + '    ::: widthPercent: ', widthPercent)
        return {
          width: widthPercent + '%'
        }
      }
    },
    ready: () => {
      this.$watch('actions', function () {
        alert('actions')
        console.log('actions')
      }, {deep: true})
    }

  }
</script>

<style>

</style>

