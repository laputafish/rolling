<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app',
    methods: {
      reset () {
        let vm = this
        vm.drawn = []
        vm.resetNumbers()
      },
      startRolling () {
        let vm = this

        if (vm.numbers.length === 0) return
        if (vm.numbers.length === 1) {
          vm.number = vm.numbers[0]
          vm.parseDigits()
          vm.drawn.push(vm.number)
          vm.numbers.splice(0, 1)
          return
        }
        vm.running = true
        setTimeout(() => {
          vm.running = false
        }, vm.duration * 1000)

        vm.runningId = setInterval(() => {
          do {
            vm.selectedIndex = Math.floor(Math.random() * vm.numbers.length)
          } while (vm.selectedIndex === vm.lastIndex && vm.numbers.length > 1)
          vm.lastIndex = vm.selectedIndex

          vm.number = vm.numbers[vm.selectedIndex]
          vm.parseDigits()
          if (!vm.running) {
            clearInterval(vm.runningId)
            vm.runningId = false
            vm.drawn.push(vm.number)
            vm.numbers.splice(vm.selectedIndex, 1)
          }
        }, 100)
      },
      resetNumbers () {
        let vm = this
        vm.drawn = []

        let dataURL = '/static/config.json'
        vm.$http.get(dataURL).then(function (response) {
          return response.json()
        }, function (error) {
          console.log('error: ', error)
        }).then(function (data) {
          console.log('got config.json')
          if (data.total) {
            vm.total = data.total
            vm.numbers = [vm.total]
          }
          if (data.duration) {
            vm.duration = data.duration
          }
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
          for (var i = 0; i < vm.total; i++) {
            vm.numbers[i] = i + 1
          }
          vm.number = 1
          vm.parseDigits()
        })
      },
      parseDigits () {
        let vm = this
        vm.digit0 = vm.number % 10
        vm.digit1 = Math.floor(vm.number / 10) % 10
        vm.digit2 = Math.floor(vm.number / 100)
      }
    },
    mounted () {
      let vm = this
      vm.resetNumbers()
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
      }
    },
    data () {
      return {
        useText: false,
        runningId: null,
        number: 1,
        drawn: [],
        numbers: [],
        running: false,
        total: 100,
        lastIndex: -1,
        digit0: 0,
        digit1: 0,
        digit2: 0,
        duration: 3,
        activeNumberStyle: {color: '#fffaae'},
        drawnNumberStyle: {color: 'black', backgroundColor: 'white'}
      }
    }
  }
</script>

<style>
  body {
    margin: 0;
  }
  .content-pane {
    margin-top:70px;
  }
</style>

<style lang="scss">
  @import "./assets/custom-bootstrap.scss";
  @import "../node_modules/bootstrap/scss/bootstrap.scss";
  @import "../node_modules/bootstrap-vue/dist/bootstrap-vue.css";
  @import "./assets/scss/style";
</style>
