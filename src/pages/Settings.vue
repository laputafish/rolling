<template>
  <div>
    <my-header
      @commandHandler="processCommand"
      command="save"
      commandLabel="Save"
      code=""
      :useCode="false"
      notes="Effect relfected on frontend only after refresh."
      icon="fa-save">
    </my-header>
    <vue-toastr
      ref="toastr"
      click-close="true"></vue-toastr>
    <div class="content-pane container">
      <div class="row" v-for="(setting,key) in settings">
        <div class="form-group col-6 col-md-4">
          <label for="startNumber">Start Number</label>
          <input type="number" class="form-control" id="startNumber" name="endNumber"
                 :value="setting.startNumber"
                 @change="saveStartNumber"
                 placeholder="Start number">
        </div>
        <div class="form-group col-6 col-md-4">
          <label for="endNumber">End Number</label>
          <input type="number" class="form-control" id="endNumber" name="endNumber"
                 :value="setting.endNumber"
                 @change="saveEndNumber"
                 placeholder="End number">
        </div>
        <div class="form-group col-6 col-md-4">
          <label for="duration">Draw Time (sec)</label>
          <input type="number" class="form-control" id="duration" name="duration"
                 :value="setting.duration"
                 @change="saveDuration"
                 placeholder="Draw time">
        </div>
        <div class="form-group col-6 col-md-4">
          <label for="digitScale">Digit Scale Radio</label>
          <input type="number" class="form-control" id="digitScale" name="digitScale"
                 :value="setting.digitScale"
                 @change="saveDigitScale"
                 placeholder="Digit scale ratio">
        </div>
        <div class="col-12">
          <h5>Drawn Number on Frontend</h5>
        </div>
        <div class="form-group col-6 col-md-4">
          <label for="drawnNumberColor">Text Color</label>
          <input type="text" class="form-control" id="drawnNumberColor" name="drawnNumberColor"
                 v-model="drawnNumberColor"
                 placeholder="Drawn number color">
        </div>
        <div class="form-group col-6 col-md-4">
          <label for="drawnNumberBkgdColor">Background Color</label>
          <input type="text" class="form-control" id="drawnNumberBkgdColor" name="drawnNumberBkgdColor"
                 v-model="drawnNumberBkgdColor"
                 placeholder="Drawn number background color">
        </div>

        <div class="form-group col-6 col-md-4 checkbox">
          <label for="showDrawnNumbers">Show Numbers</label><br/>
          <bootstrap-toggle
            class="form-control"
            v-model="showDrawnNumbers"
            :options="{ on: 'Yes', off: 'No'}"/>
        </div>

        <div class="form-group col-6 col-md-4 checkbox">
          <label for="showDrawnNumbers">Show Draw Button</label><br/>
          <bootstrap-toggle
            class="form-control"
            v-model="showButtons"
            :options="{ on: 'Yes', off: 'No'}"/>
        </div>
      </div>

      <!--<div class="form-group row mb-0" v-for="n in 10">-->
        <!--<label class="col-2 col-form-label pt-0 pr-0">-->
          <!--<h2><span class="my-auto badge badge-primary number-label">{{ n - 0 }}</span></h2>-->
        <!--</label>-->
        <!--<div class="col-10 input-wrapper">-->
          <!--<input class="form-control" v-model="numberWidths[n-1]"/>-->
        <!--</div>-->
      <!--</div>-->
    </div>
  </div>

</template>

<script>
  import Header from './results/header'
  import {db, settingsRef} from '../firebase'
  import BootstrapToggle from 'vue-bootstrap-toggle'

  export default {
    components: {
      myHeader: Header,
      BootstrapToggle
    },
    data () {
      return {
        startNumber: 1,
        endNumber: 1,
        duration: 1,
        digitScale: 0.8,
        drawnNumberColor: 'white',
        drawnNumberBkgdColor: 'black',
        showDrawnNumbers: false,
        showButtons: false,
        numberWidths: [10]
      }
    },
    firebase: {
      settings: settingsRef
    },
    mounted () {
      let vm = this
      // change global progress bar
      this.$toastr.defaultTimeout = 2000
      this.$toastr.defaultProgressBar = false

      db.ref('settings').once('value', function () {
        for (var key in vm.settings) {
          vm.startNumber = parseInt(vm.settings[key].startNumber)
          vm.endNumber = parseInt(vm.settings[key].endNumber)
          vm.duration = parseInt(vm.settings[key].duration)

          if (typeof vm.settings[key].digitScale !== 'undefined') vm.digitScale = parseFloat(vm.settings[key].digitScale)
          if (typeof vm.settings[key].drawnNumberColor !== 'undefined') vm.drawnNumberColor = vm.settings[key].drawnNumberColor
          if (typeof vm.settings[key].drawnNumberBkgdColor !== 'undefined') vm.drawnNumberBkgdColor = vm.settings[key].drawnNumberBkgdColor
          if (typeof vm.settings[key].showDrawnNumbers !== 'undefined') vm.showDrawnNumbers = vm.settings[key].showDrawnNumbers
          if (typeof vm.settings[key].showButtons !== 'undefined') vm.showButtons = vm.settings[key].showButtons
          break
        }
        if (vm.settings[key].numberWidths) {
          vm.numberWidths = vm.settings[key].numberWidths.split(',')
        } else {
          vm.numberWidths = '125,88,117,121,130,120,149,107,127,145'.split(',')
        }
      })
    },
    methods: {
      processCommand (params) {
        let vm = this
        switch (params.command) {
          case 'save':
            vm.save()
        }
      },
      saveStartNumber (event) {
        console.log('startNumber :: value: ', event.target.value)
        this.startNumber = event.target.value
      },
      saveEndNumber (value) {
        this.endNumber = event.target.value
      },
      saveDuration (value) {
        this.duration = event.target.value
      },
      saveDigitScale (value) {
        this.digitScale = event.target.value
      },
      saveDrawnNumberColor (value) {
        this.drawnNumberColor = event.target.value
      },
      saveDrawnNumberBkgdColor (value) {
        this.drawnNumberBkgdColor = event.target.value
      },
      save () {
        let vm = this
        console.log('save :: vm.numberWidths: ', vm.numberWidths)
        settingsRef.child('values').set({
          startNumber: parseInt(vm.startNumber),
          endNumber: parseInt(vm.endNumber),
          duration: parseInt(vm.duration),
          digitScale: parseFloat(vm.digitScale),
          drawnNumberColor: vm.drawnNumberColor,
          drawnNumberBkgdColor: vm.drawnNumberBkgdColor,
          showDrawnNumbers: vm.showDrawnNumbers,
          showButtons: vm.showButtons,
          numberWidths: vm.numberWidths.join(',')
        })
        vm.$toastr.s('Saved.')
      }
    }
  }
</script>

<style>
  .number-label {
    min-width: 50px;
  }

  .input-wrapper {
    padding-top: 3px;
  }
</style>
