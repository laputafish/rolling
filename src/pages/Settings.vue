<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-12">
        <h4>Configuration</h4>
      </div>
    </div>
    <div class="row" v-for="(setting,key) in settings">
      <div class="form-group col-sm-6 col-md-4">
        <label for="startNumber">Start Number</label>
        <input type="number" class="form-control" id="startNumber" name="endNumber"
               :value="setting.startNumber"
               @change="saveStartNumber" placeholder="Start Number">
      </div>
      <div class="form-group col-sm-6 col-md-4">
        <label for="endNumber">End Number</label>
        <input type="number" class="form-control" id="endNumber" name="endNumber"
               :value="setting.endNumber"
               @change="saveEndNumber"
               placeholder="End Number">
      </div>
      <div class="form-group col-sm-6 col-md-4">
        <label for="duration">Draw Time (sec)</label>
        <input type="number" class="form-control" id="duration" name="duration"
               :value="setting.duration"
               @change="saveDuration"
               placeholder="Draw Time">
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12 text-center">
        <button type="button" class="btn btn-primary btn-lg" @click="save">Save</button>
      </div>
    </div>
  </div>
</template>

<script>
  import {db, settingsRef} from '../firebase'

  export default {
    data () {
      return {
        startNumber: 1,
        endNumber: 1,
        duration: 1
      }
    },
    firebase: {
      settings: settingsRef
    },
    mounted () {
      let vm = this
      db.ref('settings').once('value', function () {
        for (var key in vm.settings) {
          vm.startNumber = vm.settings[key].startNumber
          vm.endNumber = vm.settings[key].endNumber
          vm.duration = vm.settings[key].duration
          break
        }
      })
   //   let vm = this
    //  let keys = Object.keys(settingsRef)
//      console.log('keys: ', keys)
   //   console.log('setting:', this.settings['values'])
//      console.log('settingss: ', settings)
//      vm.startNumber = settings.startNumber
//      vm.endNumber = settings.endNumber
//      vm.duration = settings.duration
    },
    watch: {
      settings: (settings) => {
        console.log('watch settings')
        for (var key in settings) {
          console.log('key: ', key)
        }
      //  console.log('settings: ', settings)
      }
    },
    methods: {
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
      save () {
        let vm = this
        settingsRef.update({
          values: {
            startNumber: vm.startNumber,
            endNumber: vm.endNumber,
            duration: vm.duration
          }
        })
      }
    }
  }
</script>

<style>

</style>
