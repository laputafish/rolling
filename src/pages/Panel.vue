<template>
  <div>
    <my-header
      @commandHandler="processCommand"
      command=""
      commandLabel="Reset"
      :useCode="true"
      code="reset"
      icon="fa-recycle">
    </my-header>
    <div class="container" style="margin-top: 70px;">
      <div class="row">
        <div class="col-sm-12">
          <button :disabled="processing" type="button" @click="draw" class="py-5 btn btn-primary btn-large btn-block">
            <h1>Draw</h1>
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
  </div>
</template>

<script>
  import {db, settingsRef, actionsRef, stationsRef} from '../firebase'
  import Header from './results/header'
//  let Pusher = require('pusher-js')

  export default {
    components: {
      myHeader: Header
    },
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
        dbSettings: [],
        processing: false,
        processingIntervalId: ''
      }
    },
    firebase: {
      dbSettings: settingsRef,
      actions: actionsRef,
      stations: stationsRef
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
      processCommand () {

      },
      draw () {
        let vm = this
        vm.processing = true
        if (vm.actions.length > 0) {
          // remove all 'draw' action
          for (var i = 0; i < vm.actions.length; i++) {
            let action = vm.actions[i]
            console.log('action: ', action)
            if (action.draw) {
              let key = action['.key']
              actionsRef.child(key).remove()
            }
          }

          // get last active station key
          stationsRef.once('value', (snapshot) => {
            let value = snapshot.val()
            let stationKey = ''
            for (var key in value) {
              stationKey = key
              break
            }
            if (stationKey !== '') {
              // set 'draw' action (value => station key)
              actionsRef.child('lottery').set({
                draw: stationKey
              })
              vm.value = 0
              let processingIntervalId = setInterval(() => {
                vm.value++
                if (vm.value >= vm.max) {
                  clearInterval(processingIntervalId)
                  vm.processingIntervalId = ''
                  vm.processing = false
                }
              }, 100)
            }
          })
        }
      }
    },
//    watch: {
//      actions: {
//        deep: true,
//        handler (newArray) {
//          console.log('actionsRef :: value: ', newArray)
//        }
//      }
//    },
    computed: {
      progressStyle () {
        let vm = this
        let widthPercent = Math.floor(vm.value * 100 / vm.max)
//        console.log(
//          'value=' + vm.value +
//          ', min=' + vm.min +
//          ', max=' + vm.max +
//          '    ::: widthPercent: ',
//          widthPercent)
        return {
          width: widthPercent + '%'
        }
      }
    }
  }
</script>

<style>

</style>

