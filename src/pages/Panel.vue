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
      <div class="row fixed-bottom button-row btn-group mx-1">
        <button
          @click="identify"
          type="button"
          class="text-lg btn btn-xl btn-outline-primary col-6 p-3">
          <h4 class="px-1 m-0 text-center">Identify Active PC</h4>
        </button>
        <button
          @click="lock"
          type="button"
          class="btn btn-xl btn-outline-primary col-6 p-4">
          <h4 class="px-1 text-center">
            <i
              class="fa fa-fw"
              :class="{'fa-lock':locked, 'fa-unlock':!locked}"></i>
              <span>Lock PC</span>
          </h4>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import {settingsRef, actionsRef, stationsRef, commandsRef} from '../firebase'
  import Navbar from '../components/common/Navbar'
  import Header from '../components/common/header'
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
        mouseDownTimerId: null,
        lastStationKey: '',
        locked: false
      }
    },
    firebase: {
      dbSettings: settingsRef,
      actions: actionsRef,
      stations: stationsRef,
      commands: commandsRef
    },
    mounted () {
      let vm = this
      console.log('Panel mounted :: panelKey = ' + vm.$store.state.panelKey)
      // if (vm.$store.state.panelKey === '') {
      //   vm.$router.push('/cp/login')
      // }
      settingsRef.on('value', function () {
        for (var key in vm.dbSettings) {
          vm.settings.duration = vm.dbSettings[key].duration
          vm.max = vm.settings.duration * 10
        }
      })
      // db.ref('actions').once('value', function () {
      //   console.log('actionsRef:', vm.actionsRef)
      // })
      stationsRef.on('value', (snapshot) => {
        let stations = snapshot.val()
        vm.locked = false
        vm.lastStationKey = ''
        for (var stationKey in stations) {
          let station = stations[stationKey]
          console.log('station: ', station)
          if (station.active) {
            vm.locked = true
            vm.lastStationKey = stationKey
            break
          }
        }
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
      lock () {
        let vm = this
        if (!vm.locked) {
          console.log('vm.lastStationKey = ' + vm.lastStationKey)
          vm.getStation((stationKey, station) => {
            station.active = true
            stationsRef.child(stationKey).set(station)
            vm.locked = true
            vm.sendCommand('identify')
          }, vm.lastStationKey)
        } else {
          stationsRef.once('value', (snapshot) => {
            let stations = snapshot.val()
            for (var stationKey in stations) {
              let station = stations[stationKey]
              station.active = false
              stationsRef.child(stationKey).set(station)
              vm.sendCommand('identify', stationKey)
            }
            vm.locked = false
          })
        }
      },
      getStation (callback, stationKey) {
        if (typeof stationKey === 'undefined') {
          stationKey = ''
        }

        if (stationKey !== '') {
          if (typeof callback !== 'undefined') {
            stationsRef.child(stationKey).once('value', (snapshot) => {
              let station = snapshot.val()
              callback(stationKey, station)
            })
          }
        } else {
          stationsRef.once('value', (snapshot) => {
            let stations = snapshot.val()
            let theStation = null
            let theStationKey = null
            let lastStation = null
            let lastStationKey = null
            for (var stationKey in stations) {
              console.log('for key=' + stationKey)
              let station = stations[stationKey]
              if (station.active) {
                theStation = station
                theStationKey = stationKey
                break
              }
              lastStation = station
              lastStationKey = stationKey
            }
            if (theStation === null) {
              theStation = lastStation
              theStationKey = lastStationKey
            }
            console.log('theStationKey = ' + theStationKey)
            if (theStation !== null) {
              callback(theStationKey, theStation)
            }
          })
        }
      },
      identify () {
        this.sendCommand('identify')
      },
      xxxxx_sendCommand (callback) {
        stationsRef.once('value', (snapshot) => {
          let value = snapshot.val()
          let stationKey = ''
          for (var key in value) {
            stationKey = key
            break
          }
          if (stationKey !== '') {
            callback(stationKey)
          }
        })
      },
      sendCommand (command, stationKey) {
        let vm = this
        if (typeof stationKey === 'undefined') {
          vm.getStation((stationKey, station) => {
            commandsRef.remove()
            commandsRef.push({
              command: command,
              stationKey: stationKey
            })
          })
        } else {
          commandsRef.remove()
          commandsRef.push({
            command: command,
            stationKey: stationKey
          })
        }
      },
      draw () {
        this.sendCommand('draw')
      },
      draw2 () {
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

  .button-row button {
    cursor: pointer;
  }
  .button-row button h4 {
    white-space: normal;
  }
  .button-row button:hover {
    // background-color: #4da3ff
  }
  .button-row {
    margin-bottom:60px;
  }
</style>
