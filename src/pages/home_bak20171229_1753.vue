<template>
  <div id="home">
    <div class="active-number-wrapper">
      <div class="active-number" :style="activeNumberStyle" v-if="useText">{{ number }}</div>
      <div class="active-number digit" :style="digit2Style" :class="'digit'+digit2" v-if="!useText">&nbsp;</div>
      <div class="active-number digit" :style="digit1Style" :class="'digit'+digit1" v-if="!useText">&nbsp;</div>
      <div class="active-number digit" :style="digit0Style" :class="'digit'+digit0" v-if="!useText">&nbsp;</div>
    </div>
    <div id="footer-pane">
      <div class="drawn-numbers">
        <div
          v-for="d in drawnNumbers"
          v-if="showDrawnNumbers"
          :style="drawnNumberStyle"
          class="drawn-number">{{ d.number }}</div>
      </div>
      <div class="button-group" v-if="showButtons">
        <div class="btn-group" role="group">
          <button :disabled="(running || numbers.length==0)" :class="{enabled:(!running && numbers.length>0)}" class="btn btn-default" @click="startRolling">Start</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {stationsRef, drawnNumbersRef, settingsRef, actionsRef} from '../firebase'
  import {getCurrDateTime} from '../helpers/util.js'

  export default {
    name: 'home',
    firebase: {
      drawnNumbers: drawnNumbersRef,
      settings: settingsRef,
      actions: actionsRef,
      stations: stationsRef
    },
    methods: {
      reset () {
        let vm = this
        // vm.drawn = []
        vm.resetNumbers()
      },
      adjustNumbers () {
        let vm = this
        if (vm.drawnNumbers) {
          for (var i = 0; i < vm.drawnNumbers.length; i++) {
            let number = vm.drawnNumbers[i].number
            for (var j = 0; j < vm.numbers.length; j++) {
              if (vm.numbers[j] === number) {
                console.log('remove number: ' + number)
                vm.numbers.splice(j, 1)
                break
              }
            }
          }
        }
      },
      startRolling () {
        let vm = this
        if (!vm.running) {
          vm.running = true
          drawnNumbersRef.once('value', () => {
            console.log('drawnNumbersRef once(value)')
            vm.initNumbers()
            vm.adjustNumbers()
            vm.doStartRolling()
          })
        }
      },
      doStartRolling () {
        let vm = this

        if (vm.numbers.length === 0) {
          vm.running = false
          return
        }

        if (vm.numbers.length === 1) {
          vm.number = vm.numbers[0]
          vm.showNumber()
          // vm.drawn.push(vm.number)
          vm.numbers.splice(0, 1)
          console.log('lenght==1 => push number (' + vm.number + ') to drawnNumbers')
          drawnNumbersRef.push({
            number: vm.number,
            drawn_at: getCurrDateTime()
          })
          vm.running = false
          return
        }
        let timeoutId = setTimeout(() => {
          clearTimeout(timeoutId)
          vm.running = false
          console.log('timeout')
        }, vm.duration * 1000)

        vm.runningId = setInterval(() => {
          do {
            vm.selectedIndex = Math.floor(Math.random() * vm.numbers.length)
          } while (vm.selectedIndex === vm.lastIndex && vm.numbers.length > 1)
          vm.lastIndex = vm.selectedIndex
          vm.number = vm.numbers[vm.selectedIndex]
          console.log('rolling :: vm.selectedIndex = ' + vm.selectedIndex + ' (' + vm.number + ')')
          vm.showNumber()
          if (!vm.running) {
            clearInterval(vm.runningId)
            vm.runningId = false
            // vm.drawn.push(vm.number)
            vm.numbers.splice(vm.selectedIndex, 1)
            console.log('!running => push number (' + vm.number + ') to drawnNumbers')
            drawnNumbersRef.push({
              number: vm.number,
              drawn_at: getCurrDateTime()
            })
          }
        }, 100)
      },
      resetNumbersxxx () {
        let vm = this
        // vm.drawn = []

        let dataURL = '/static/config.json'
        vm.$http.get(dataURL).then(function (response) {
          return response.json()
        }, function (error) {
          console.log('error: ', error)
        }).then(function (data) {
          console.log('got config.json')
          // if (data.total) {
          //   vm.total = data.total
          //   vm.numbers = [vm.total]
          // }
          // if (data.duration) {
          //   vm.duration = data.duration
          // }
          if (data.useText) {
            vm.useText = data.useText
          }
          if (data.active_number_color) {
            vm.activeNumberStyle.color = data.active_number_color
          }
          if (data.drawn_number_bkgd_color) {
            vm.drawnNumberStyle.backgroundColor = data.drawn_number_bkgd_color
          }
          if (data.drawn_number_color) {
            vm.drawnNumberStyle.color = data.drawn_number_color
          }
          if (data.font_family) {
            vm.drawnNumberStyle.fontFamily = data.font_family
          }
          if (data.font_weight) {
            vm.drawnNumberStyle.fontWeight = data.font_weight
          }
          for (var i = vm.startNumber; i <= vm.endNumber; i++) {
            vm.numbers[i - vm.startNumber] = i
          }
//          console.log('resetNumbers: total = ' + vm.total)
          console.log('resetNumbers: vm.numbers.length =' + vm.numbers.length)
          vm.number = 1
          vm.showNumber()
        })
      },
      updateSettings (settings, withNumberRange) {
        console.log('updateSettings :: settings: ', settings)
        console.log('updateSettings :: settings.showDrawnNumbers : ', settings.showDrawnNumbers)
        let vm = this
        if (typeof withNumberRange === 'undefined') {
          withNumberRange = true
        }

        if (withNumberRange) {
          if (settings.startNumber) vm.startNumber = settings.startNumber
          if (settings.endNumber) vm.endNumber = settings.endNumber
          if (settings.duration) vm.duration = settings.duration
        }
        if (typeof settings.digitScale !== 'undefined') {
          vm.digitScale = settings.digitScale
        }
        if (typeof settings.useText !== 'undefined') {
          vm.useText = settings.useText
        }
        if (typeof settings.active_number_color !== 'undefined') {
          vm.activeNumberStyle.color = settings.active_number_color
        }
        if (typeof settings.drawnNumberBkgdColor !== 'undefined') {
          vm.drawnNumberStyle.backgroundColor = settings.drawnNumberBkgdColor
        }
        if (typeof settings.drawnNumberColor !== 'undefined') {
          vm.drawnNumberStyle.color = settings.drawnNumberColor
        }
        if (typeof settings.font_family !== 'undefined') {
          vm.drawnNumberStyle.fontFamily = settings.font_family
        }
        if (typeof settings.font_weight !== 'undefined') {
          vm.drawnNumberStyle.fontWeight = settings.font_weight
        }
        if (typeof settings.showDrawnNumbers !== 'undefined') {
          vm.showDrawnNumbers = settings.showDrawnNumbers
        }
        if (typeof settings.showButtons !== 'undefined') {
          vm.showButtons = settings.showButtons
        }
      },
      initNumbers () {
        let vm = this
        let total = vm.endNumber - vm.startNumber + 1
        vm.numbers = [total]
        for (var i = vm.startNumber; i <= vm.endNumber; i++) {
          vm.numbers[i - vm.startNumber] = i
        }
      },
      showNumber () {
        let vm = this
        vm.digit0 = vm.number % 10
        vm.digit1 = Math.floor(vm.number / 10) % 10
        vm.digit2 = Math.floor(vm.number / 100)
      }
    },
    mounted: function () {
      let vm = this
      console.log('vm: ', vm)

      // register stations
      let ref = stationsRef.push({
        station: getCurrDateTime()
      })
      vm.stationKey = ref.key

      // Stations
      stationsRef.once('value', (snapshot) => {
        let value = snapshot.val()
        for (var key in value) {
          if (key !== vm.stationKey) {
            stationsRef.child(key).remove()
          }
        }
      })

//      stationsRef.once('value', () => {
//        let ref = stationsRef.push({
//          station: getCurrDateTime()
//        })
//        vm.stationKey = ref.key
//        console.log('stationKey = ' + vm.stationKey)
//        console.log('stationsRef.length = ' + stationsRef.length)
//        for (var i = 0; i < vm.stations.length; i++) {
//          let key = vm.stations[i]['.key']
//          if (key !== vm.stationKey) {
//            console.log('remove station #' + key)
//            stationsRef.child(key).remove()
//          }
//        }
//      })

      // Settings
      settingsRef.on('value', () => {
        if (vm.settings) {
          if (vm.settings.length > 0) {
            vm.updateSettings(vm.settings[0])
          }
          drawnNumbersRef.once('value', () => {
            vm.initNumbers()
            vm.adjustNumbers()
            vm.number = 0
            // vm.number = vm.endNumber
            // if (vm.numbers.length > 0) {
            //   vm.number = vm.numbers[0]
            // }
            vm.showNumber()
          })
        }
      })

//      settingsRef.on('value', () => {
//        if (vm.settings.length > 0) {
//          vm.updateSettings(vm.settings[0], false)
//        }
//      })

//      actionsRef.child('lottery').on('value', (snapshot) => {
//        let lotteryValue = snapshot.val()
//        if (lotteryValue) {
//          if (lotteryValue.draw) {
//            lotteryValue.draw = null
//            actionsRef.child('lottery').update(lotteryValue)
//            console.log('actionsRef :: value :: updated')
//            vm.startRolling()
//          }
//        }
//      })

      actionsRef.child('lottery').on('child_added', (snapshot) => {
        console.log('actionsRef :: child_added')
        let lotteryValue = snapshot.val()
        console.log('child_added :: lotteryValue: ', lotteryValue)
        console.log('stationKey = ', vm.stationKey)
        if (lotteryValue === vm.stationKey) {
          actionsRef.child('lottery').update({
            draw: null
          })
          console.log('actionsRef :: value :: updated')
          vm.startRolling()
        }
      })

//      actionsRef.child('lottery').on('child_added', (snapshot) => {
//        let value = snapshot.val()
//        console.log('snapshot: ', snapshot)
//        console.log('child_added  value:', value)
//        console.log('actions.length =' + vm.actions.length)
//        if (vm.actions.length > 0) {
//          console.log('vm.actions.length > 0')
//          if (vm.actions[0].draw) {
//            console.log('vm.actions[0].draw')
//            if (actionsRef.child('lottery')) {
//              // actionsRef.child('lottery').child('draw').remove()
//              console.log('remove draw')
//            }
//          }
//        }
//      })
    },
    computed: {
      getDigit0Class () {
        let vm = this
        return 'digit' + vm.number % 10
      },
      getDigit1Class () {
        let vm = this
        return vm.number >= 10 ? 'digit' + String(vm.number).substring(-1, 1) : ''
      },
      getDigit2Class () {
        let vm = this
        return vm.number >= 100 ? 'digit' + String(vm.number).substring(-2, 1) : ''
      },
      digit0Style () {
        let vm = this
        let digitWidth = vm.digitWidths[vm.digit0] * vm.digitScale
        return {
          width: digitWidth + 'px'
        }
      },
      digit1Style () {
        let vm = this
        let digitWidth = vm.digitWidths[vm.digit1] * vm.digitScale
        if (vm.number < 10) digitWidth = 0
        return {
          width: digitWidth + 'px'
        }
      },
      digit2Style () {
        let vm = this
        let digitWidth = vm.digitWidths[vm.digit2] * vm.digitScale
        if (vm.number < 100) digitWidth = 0
        return {
          width: digitWidth + 'px'
        }
      }
    },
    data () {
      return {
        stationKey: '',
        useText: false,
        runningId: null,
        number: 1,
        // drawn: [],
        numbers: [],
        running: false,
        // total: 100,
        startNumber: 1,
        endNumber: 10,
        lastIndex: -1,
        digit0: 0,
        digit1: 0,
        digit2: 0,
        duration: 3,
        activeNumberStyle: {color: '#fffaae'},
        drawnNumberStyle: {color: 'white', backgroundColor: 'black'},
        showDrawnNumbers: false,
        digitScale: 0.8,
        showButtons: true,
        digitWidths: [
          125, // 0
          88, // 1
          117, // 2
          121, // 3
          130, // 4
          120, // 5
          123, // 6
          107, // 7
          127, // 8
          123
        ]
      }
    }
  }
</script>

<style lang="scss">
  @import "../assets/scss/digits.scss";
</style>

<style>
  .active-number-wrapper {
    width: 100%;
    top:38%;
    text-align: center;
    height: 200px;
    position: absolute;
  }
  .active-number-wrapper .active-number.digit {
    margin-top: 10px;
    margin-left: 3px;
  }

  .active-number-wrapper .active-number {
    margin-top: -30px;
    display: inline-block;
    font-size: 140px;
    /*color: #fffaae;*/
    font-weight: 600;
    margin-left: 30px;
  }

  #home {
    background-image: url("/static/img/lucky_draw_center.jpg");
    background-repeat: no-repeat;
    background-position: center 30%;
    background-size: 160%;
    display:table-cell;
    vertical-align:middle;
    height: 100%;
    background-color: black;
    position: absolute;
    right: 0;
    left: 0;
    font-family: Arial;
  }
  @media(min-width:480px) {
    #home {
      background-size: 100% auto;
    }
    .active-number-wrapper {
      top: 40%;
    }
  }
  @media(min-width:768px) {
    #home {
      background-size: 100% auto;
    }
    .active-number-wrapper {
      top: 45%;
    }
  }
  @media(min-width:1080px) {
    #home {
      background-image: url("/static/img/lucky_draw_bkgd.gif");
    }
    .active-number-wrapper {
      top: 38%;
    }
  }

  @media(min-width:1280px) {
    #home {
      background-position: center;
    }
    .active-number-wrapper {
      top: 50%;
    }
  }
  .drawn-numbers {
    width: 100%;
    height: 180px;
    background-color: transparent;
  }
  .drawn-number {
    font-size: 32px;
    margin: 5px;
    background-color: black;
    border-radius: .4em;
    color: white;
    padding: .4em .2em .3em .2em;
    display: inline-block;
    line-height: 32px;
    min-width: 1.6em;
    text-align: center;
  }
  @media(min-width: 480px) {
    .drawn-number {
      font-size:64px;
    }
  }
  #footer-pane {
    bottom: 0;
    height: 220px;
    background-color: transparent;
    position: absolute;
    width: 100%;
  }

  @media( min-width: 480px ) {
    #footer-pane {
      height: 260px;
    }
  }

  .button-group {
    position: absolute;
    right:0;
    bottom:0;
    padding:10px;
    background-color:#222;
  }
  .button-group .btn-group {
    position: relative;
  }
  .button-group .btn-group button.enabled:hover {
    cursor: pointer;
  }
  .button-group .btn-group button {
    background-color: #333;
    margin-left: 3px;
    color: #888;
    font-size: 24px;
    border:#444 solid 1px;
  }
  .button-group .btn-group button:active {
    border:#444 solid 1px;
  }

  /*.digit1 {*/
  /*background: url('/static/img/numbers.png') -69px 0;*/
  /*width: 69px;*/
  /*height: 97px;*/
  /*display: inline-block;*/
  /*}*/
  /*.digit2 {*/
  /*background: url('/static/img/numbers.png') -138px 0;*/
  /*width: 69px;*/
  /*height: 97px;*/
  /*display: inline-block;*/
  /*}*/
  /*.digit3 {*/
  /*background: url('/static/img/numbers.png') -207px 0;*/
  /*width: 69px;*/
  /*height: 97px;*/
  /*display: inline-block;*/
  /*}*/
  /*.digit4 {*/
  /*background: url('/static/img/numbers.png') -276px 0;*/
  /*width: 69px;*/
  /*height: 97px;*/
  /*display: inline-block;*/
  /*}*/
  /*.digit5 {*/
  /*background: url('/static/img/numbers.png') -345px 0;*/
  /*width: 69px;*/
  /*height: 97px;*/
  /*display: inline-block;*/
  /*}*/
  /*.digit6 {*/
  /*background: url('/static/img/numbers.png') -414px 0;*/
  /*width: 69px;*/
  /*height: 97px;*/
  /*display: inline-block;*/
  /*}*/
  /*.digit7 {*/
  /*background: url('/static/img/numbers.png') -483px 0;*/
  /*width: 69px;*/
  /*height: 97px;*/
  /*display: inline-block;*/
  /*}*/
  /*.digit8 {*/
  /*background: url('/static/img/numbers.png') -552px 0;*/
  /*width: 69px;*/
  /*height: 97px;*/
  /*display: inline-block;*/
  /*}*/
  /*.digit9 {*/
  /*background: url('/static/img/numbers.png') -621px 0;*/
  /*width: 69px;*/
  /*height: 97px;*/
  /*display: inline-block;*/
  /*}*/


</style>
