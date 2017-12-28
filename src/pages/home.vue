<template>
  <div id="home">
    <div class="active-number-wrapper">
      <div class="active-number" :style="activeNumberStyle" v-if="useText">{{ number }}</div>
      <div class="active-number digit" :style="digit2Style" :class="'digit'+digit2" v-if="!useText && digit2!=0">&nbsp;</div>
      <div class="active-number digit" :style="digit1Style" :class="'digit'+digit1" v-if="!useText && digit1!=0">&nbsp;</div>
      <div class="active-number digit" :style="digit0Style" :class="'digit'+digit0" v-if="!useText">&nbsp;</div>
    </div>
    <div id="footer-pane">
      <div class="drawn-numbers">
        <div v-for="d in drawnNumbers" :style="drawnNumberStyle" class="drawn-number">{{ d.number }}</div>
      </div>
      <div class="button-group">
        <div class="btn-group" role="group">
          <button :disabled="(running || numbers.length==0)" :class="{enabled:(!running && numbers.length>0)}" class="btn btn-default" @click="startRolling">Start</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {drawnNumbersRef, settingsRef, actionsRef} from '../firebase'
  import {getCurrDateTime} from '../helpers/util.js'

  export default {
    name: 'home',
    firebase: {
      drawnNumbers: drawnNumbersRef,
      settings: settingsRef,
      actions: actionsRef
    },
    methods: {
      watch: {
        actionsRef: {
          deep: true,
          handler: () => {
            alert('actionsRef')
          }
        }
      },
      reset () {
        let vm = this
        // vm.drawn = []
        vm.resetNumbers()
      },
      adjustNumbers () {
        let vm = this
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
      },
      startRolling () {
        let vm = this
        drawnNumbersRef.once('value', () => {
          vm.initNumbers()
          vm.adjustNumbers()
          vm.doStartRolling()
        })
      },
      doStartRolling () {
        let vm = this

        if (vm.numbers.length === 0) return
        if (vm.numbers.length === 1) {
          vm.number = vm.numbers[0]
          vm.showNumber()
          // vm.drawn.push(vm.number)
          vm.numbers.splice(0, 1)
          drawnNumbersRef.push({
            number: vm.number,
            drawn_at: getCurrDateTime()
          })
          return
        }
        vm.running = true
        setTimeout(() => {
          vm.running = false
          console.log('timeout')
        }, vm.duration * 1000)

        vm.runningId = setInterval(() => {
          do {
            vm.selectedIndex = Math.floor(Math.random() * vm.numbers.length)
          } while (vm.selectedIndex === vm.lastIndex && vm.numbers.length > 1)
          vm.lastIndex = vm.selectedIndex
          console.log('rolling :: vm.selectedIndex = ' + vm.selectedIndex)
          vm.number = vm.numbers[vm.selectedIndex]
          vm.showNumber()
          if (!vm.running) {
            clearInterval(vm.runningId)
            vm.runningId = false
            // vm.drawn.push(vm.number)
            vm.numbers.splice(vm.selectedIndex, 1)
            console.log('number: ', vm.number)
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
      updateSettings (settings) {
        let vm = this
        if (settings.startNumber) vm.startNumber = settings.startNumber
        if (settings.endNumber) vm.endNumber = settings.endNumber
        if (settings.duration) vm.duration = settings.duration
        if (settings.digitScale) vm.digitScale = settings.digitScale
        if (settings.useText) vm.useText = settings.useText
        if (settings.active_number_color) vm.activeNumberStyle.color = settings.active_number_color
        if (settings.drawnNumberBkgdColor) vm.drawnNumberStyle.backgroundColor = settings.drawnNumberBkgdColor
        if (settings.drawnNumberColor) vm.drawnNumberStyle.color = settings.drawnNumberColor
        if (settings.font_family) vm.drawnNumberStyle.fontFamily = settings.font_family
        if (settings.font_weight) vm.drawnNumberStyle.fontWeight = settings.font_weight
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

      settingsRef.once('value', () => {
        if (vm.settings.length > 0) {
          vm.updateSettings(vm.settings[0])
        }
        console.log('settingsRef.once(value): vm.startNumber = ' + vm.startNumber)
        console.log('settingsRef.once(value): vm.endNumber = ' + vm.endNumber)
        console.log('settingsRef.once(value): vm.duration = ' + vm.duration)
        drawnNumbersRef.once('value', () => {
          vm.initNumbers()
          console.log('once :: vm.drawnNumbers.length = ' + vm.drawnNumbers.length)
          console.log('once :: vm.numbers.length = ' + vm.numbers.length)
          vm.adjustNumbers()
          console.log('after splice :: vm.numbers.length = ' + vm.numbers.length)
          vm.number = vm.endNumber
          if (vm.numbers.length > 0) {
            vm.number = vm.numbers[0]
          }
          vm.showNumber()
        })
      })

//      actionsRef.child('lottery').on('value', (snapshot) => {
//        let lotteryValue = snapshot.val()
//        if (lotteryValue.draw) {
//          lotteryValue.draw = null
//          actionsRef.child('lottery').update(lotteryValue)
//          // vm.startRolling()
//        }
//      })

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
        return {
          width: digitWidth + 'px'
        }
      },
      digit2Style () {
        let vm = this
        let digitWidth = vm.digitWidths[vm.digit2] * vm.digitScale
        return {
          width: digitWidth + 'px'
        }
      }
    },
    data () {
      return {
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
        digitScale: 0.8,
        digitWidths: [
          125, // 0
          88, // 1
          117, // 2
          121, // 3
          130, // 4
          120, // 5
          149, // 6
          107, // 7
          127, // 8
          145
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
      background-image: url("/static/img/lucky_draw_center.jpg");
      background-size: 100% auto;
    }
    .active-number-wrapper {
      top: 40%;
    }
  }
  @media(min-width:768px) {
    #home {
      background-image: url("/static/img/lucky_draw_center.jpg");
      background-size: 100% auto;
    }
    .active-number-wrapper {
      top: 45%;
    }
  }
  @media(min-width:1080px) {
    #home {
      background-image: url("/static/img/lucky_draw_bkgd.jpg");
    }
    .active-number-wrapper {
      top: 38%;
    }
  }

  @media(min-width:1280px) {
    #home {
      background-image: url("/static/img/lucky_draw_bkgd.jpg");
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
    font-size: 64px;
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

  #footer-pane {
    bottom: 0;
    height: 260px;
    background-color: transparent;
    position: absolute;
    width: 100%;
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
