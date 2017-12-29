<template>
  <div
    @mouseup="screenMouseUp"
    @touchend="screenMouseUp">
    <my-navbar></my-navbar>
    <div class="content-pane container">
      <div class="row">
        <div class="col-sm-12">
          <button :disabled="processing"
            @mousedown="mousedown"
            @touchstart="mousedown"
            @mouseup="mouseup"
            @touchend="mouseup"
            @mouseleave="mouseleave"
            type="button"
            :class="drawButtonClass"
            class="py-5 btn btn-large btn-block">
            <h1>Draw</h1>
          </button>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12">
          <div class="progress">
            <div class="progress-bar bg-warning process-indicator"
                 :class="progressbarClass"
                 :style="progressStyle"
                 role="progressbar"
                 :aria-valuenow="value"
                 :aria-valuemin="min"
                 :aria-valuemax="max"></div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12 text-center">
          <h4 class="mt-2">
            <span class="panel-remark badge badge-secondary p-2">
            Touch button for {{ offsetTimeOn }} to {{ offsetTimeOff }} seconds to start.
          </span>
          </h4>
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
  import Navbar from '../components/common/Navbar'
  import Header from './results/header'
//  let Pusher = require('pusher-js')

  export default {
    components: {
      myNavbar: Navbar,
      myHeader: Header
    },
    data () {
      return {
        offsetTimeOn: 1,
        offsetTimeOff: 2,
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
        processingIntervalId: '',
        mouseIsDown: false,
        progressBarDisabled: false,
        drawButtonState: 'preparing', // 'preparing', 'ready', 'expired'
        mouseDownTimerId: null
      }
    },
    firebase: {
      dbSettings: settingsRef,
      actions: actionsRef,
      stations: stationsRef
    },
    mounted () {
      let vm = this
      db.ref('settings').on('value', function () {
        for (var key in vm.dbSettings) {
          vm.settings.duration = vm.dbSettings[key].duration
          vm.max = vm.settings.duration * 10
        }
      })
      db.ref('actions').once('value', function () {
        console.log('actionsRef:', vm.actionsRef)
      })
    },
    methods: {
      screenMouseUp () {
        this.drawButtonState = 'preparing'
      },
      mouseleave () {
        let vm = this
        if (vm.mouseDownTimerId) {
          clearTimeout(vm.mouseDownTimerId)
        }
        vm.mouseDownTimerId = null
        vm.mouseIsDown = false
        vm.drawButtonState = 'preparing'
      },
      mouseup () {
        let vm = this
        let startDrawing = vm.drawButtonState === 'ready'
        if (vm.mouseDownTimerId) {
          clearTimeout(vm.mouseDownTimerId)
        }
        vm.mouseDownTimerId = null
        vm.mouseIsDown = false
        vm.drawButtonState = 'preparing'

        if (startDrawing) {
          console.log('start drawing')
          vm.draw()
        }
      },
      mousedown () {
        this.mouseIsDown = true
        this.mouseDownStartTime = new Date()
        this.startMouseDownTimer()
      },
      startMouseDownTimer () {
        let vm = this
        vm.mouseDownTimerId = setInterval(() => {
          let duration = (new Date()) - this.mouseDownStartTime
          if (duration > vm.offsetTimeOff * 1000) {
            vm.drawButtonState = 'expired'
          } else if (duration > vm.offsetTimeOn * 1000) {
            vm.drawButtonState = 'ready'
          } else {
            vm.drawButtonState = 'preparing'
          }
        }, 100)
      },
      processCommand () {
        // keep for dummy
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
  //            vm.progressbarDisabled = false
              vm.value = 0
              let processingIntervalId = setInterval(() => {
                vm.value++
                if (vm.value >= vm.max) {
                  clearInterval(processingIntervalId)
                  vm.processingIntervalId = ''
                  vm.processing = false
//                  vm.progressbarDisabled = true
                  vm.value = 0
//                  setTimeout(() => {
//                    vm.value = 0
//                  }, 1000)
//                  setTimeout(() => {
//                    vm.progressbarDisabled = false
//                  }, 500)
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
      drawButtonClass () {
        let vm = this
        switch (vm.drawButtonState) {
          case 'preparing':
            return 'btn-primary'
          case 'ready':
            return 'btn-success'
          default:
            return 'btn-danger'
        }
      },
      progressbarClass () {
        let vm = this
        return {
          disabled: vm.progressBarDisabled
        }
      },
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
  .panel-remark {
    max-width: 100%;
    white-space: normal;
    text-align: left;
  }
  .process-indicator.disabled {
    -webkit-transition: none !important;
    -moz-transition: none !important;
    -ms-transition: none !important;
    -o-transition: none !important;
    transition: none !important;
  }
</style>
