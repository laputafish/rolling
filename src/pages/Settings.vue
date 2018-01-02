<template>
  <div>
    <confirm-update-settings
      v-if="showModal"
      ref="modal"
      :code="''"
      :notes="isStartEndNumbersChanged ? 'Start/end numbers changed! Drawn numbers will be cleared.' : ''"
      notesClass="badge-danger"
      :showNotes="isStartEndNumbersChanged"
      @ok="confirm"
      @close="showModal = false">`
      <div slot="header">
        <h1>Confirmation</h1>
      </div>
    </confirm-update-settings>
    <my-header
      @commandHandler="processCommand"
      command="save"
      commandLabel="Save"
      code=""
      :useCustomDialog="true"
      :useCode="false"
      notes="Effect relfected on frontend only after refresh."
      icon="fa-save">
    </my-header>
    <vue-toastr
      ref="toastr"
      click-close="true"></vue-toastr>
    <div class="content-pane container">
      <div class="row">
        <div class="form-group col-6 col-md-4">
          <label for="startNumber">Start Number</label>
          <input
            type="number"
            class="form-control"
            id="startNumber"
            name="endNumber"
            v-model="startNumber"
            placeholder="Start number">
        </div>
        <div class="form-group col-6 col-md-4">
          <label for="endNumber">End Number</label>
          <input
            type="number"
            class="form-control"
            id="endNumber"
            name="endNumber"
            v-model="endNumber"
            placeholder="End number">
        </div>
        <div class="form-group col-6 col-md-4">
          <label for="duration">Draw Time (sec)</label>
          <input
            type="number"
            class="form-control"
            id="duration"
            name="duration"
            v-model="duration"
            placeholder="Draw time">
        </div>
        <div class="form-group col-6 col-md-4">
          <label for="digitScale">Digit Scale Radio</label>
          <input
            type="number"
            class="form-control"
            id="digitScale"
            name="digitScale"
            v-model="digitScale"
            placeholder="Digit scale ratio">
        </div>
        <div class="col-12">
          <h5>Drawn Number on Frontend</h5>
        </div>
        <div class="form-group col-6 col-md-4">
          <label for="drawnNumberColor">Text Color</label>
          <input
            type="text"
            class="form-control"
            id="drawnNumberColor"
            name="drawnNumberColor"
            v-model="drawnNumberColor"
            placeholder="Drawn number color">
        </div>
        <div class="form-group col-6 col-md-4">
          <label for="drawnNumberBkgdColor">Background Color</label>
          <input
            type="text"
            class="form-control"
            id="drawnNumberBkgdColor"
            name="drawnNumberBkgdColor"
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
    </div>
  </div>

</template>

<script>
  import Header from '../components/common/header'
  import {db, settingsRef, drawnNumbersRef} from '../firebase'
  import BootstrapToggle from 'vue-bootstrap-toggle'
  import ConfirmUpdateSettings from '../components/common/ConfirmUpdateSettings'

  export default {
    components: {
      myHeader: Header,
      BootstrapToggle,
      confirmUpdateSettings: ConfirmUpdateSettings
    },
    data () {
      return {
        oldStartNumber: 1,
        startNumber: 1,
        oldEndNumber: 10,
        endNumber: 10,
        duration: 3,
        digitScale: 0.8,
        drawnNumberColor: 'white',
        drawnNumberBkgdColor: 'black',
        showDrawnNumbers: false,
        showButtons: false,
        numberWidths: [10],

        showModal: false,
        isStartEndNumbersChanged: false
      }
    },
    mounted () {
      let vm = this
      // change global progress bar
      vm.$toastr.defaultProgressBar = false

      db.ref('settings').once('value', (snapshot) => {
        let settings = snapshot.val()
        let values = settings.values

        if (typeof values.startNumber !== 'undefined') {
          vm.oldStartNumber = vm.startNumber = parseInt(values.startNumber)
        }
        if (typeof values.endNumber !== 'undefined') {
          vm.oldEndNumber = vm.endNumber = parseInt(values.endNumber)
        }

        if (typeof values.duration !== 'undefined') vm.duration = parseInt(values.duration)
        if (typeof values.digitScale !== 'undefined') vm.digitScale = parseFloat(values.digitScale)
        if (typeof values.drawnNumberColor !== 'undefined') vm.drawnNumberColor = values.drawnNumberColor
        if (typeof values.drawnNumberBkgdColor !== 'undefined') vm.drawnNumberBkgdColor = values.drawnNumberBkgdColor
        if (typeof values.showDrawnNumbers !== 'undefined') vm.showDrawnNumbers = values.showDrawnNumbers
        if (typeof values.showButtons !== 'undefined') vm.showButtons = values.showButtons

        if (typeof values.numberWidths !== 'undefined') {
          vm.numberWidths = values.numberWidths.split(',')
        } else {
          vm.numberWidths = '125,88,117,121,130,120,149,107,127,145'.split(',')
        }

        //
        // for (var key = 0; key < vm.settings.length; key++) {
        //   let setting = vm.settings[key]
        //   console.log('Settings.vue :: setting[.key] = ' + setting['.key'])
        //   if (setting['.key'] === 'values') {
        //     vm.startNumber = parseInt(vm.settings[key].startNumber)
        //     vm.endNumber = parseInt(vm.settings[key].endNumber)
        //     vm.duration = parseInt(vm.settings[key].duration)
        //
        //     if (typeof vm.settings[key].digitScale !== 'undefined') vm.digitScale = parseFloat(vm.settings[key].digitScale)
        //     if (typeof vm.settings[key].drawnNumberColor !== 'undefined') vm.drawnNumberColor = vm.settings[key].drawnNumberColor
        //     if (typeof vm.settings[key].drawnNumberBkgdColor !== 'undefined') vm.drawnNumberBkgdColor = vm.settings[key].drawnNumberBkgdColor
        //     if (typeof vm.settings[key].showDrawnNumbers !== 'undefined') vm.showDrawnNumbers = vm.settings[key].showDrawnNumbers
        //     if (typeof vm.settings[key].showButtons !== 'undefined') vm.showButtons = vm.settings[key].showButtons
        //     break
        //   }
        // }
        // if (vm.settings[key].numberWidths) {
        //   vm.numberWidths = vm.settings[key].numberWidths.split(',')
        // } else {
        //   vm.numberWidths = '125,88,117,121,130,120,149,107,127,145'.split(',')
        // }
      })
    },
    methods: {
      confirm () {
        let vm = this
        vm.showModal = false
        vm.save()
      },
      processCommand (params) {
        let vm = this
        switch (params.command) {
          case 'save':
            // Check start/end number changed
            console.log((typeof vm.oldStartNumber) + ' oldStartNumber = ' + vm.oldStartNumber)
            console.log((typeof vm.startNumber) + ' startNumber = ' + vm.startNumber)

            console.log((typeof vm.oldEndNumber) + ' oldEndNumber = ' + vm.oldEndNumber)
            console.log((typeof vm.endNumber) + ' endNumber = ' + vm.endNumber)

            vm.isStartEndNumbersChanged =
              (vm.oldStartNumber !== vm.startNumber) ||
              (vm.oldEndNumber !== vm.endNumber)

            vm.showModal = true
            break
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
        if (vm.isStartEndNumbersChanged) {
          drawnNumbersRef.remove()
        }
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
