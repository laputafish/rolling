<template>
  <div>
    <my-header
      @commandHandler="processCommand"
      command="reset"
      commandLabel="Reset"
      :useCode="true"
      code="reset"
      notes="Type 'reset' as code."
      icon="fa-recycle">
    </my-header>
    <div class="content-pane container results-pane">
      <div class="row">
        <div class="col-3 col-sm-2 col-md-2 col-lg-1" style="padding-left:20px;padding-right:10px;"
             v-for="(item,index) in drawnNumbers">
          <small class="index-number">{{ index + 1 }}</small>
          <h2 style="display:inline-block;"><span
            class="results-drawn-number badge badge-lg badge-primary">{{ item.number }}</span></h2>
        </div>
      </div>
      <div class="row" v-if="false">
        <div class="col-sm-10 col-md-8 col-lg-6 mx-auto">
          <ul class="list-group">
            <li class="list-group-item" v-for="(item,index) in drawnNumbers">
              <div class="row">
                <div class="col-sm-1 my-auto">{{ index + 1 }}</div>
                <div class="col-sm-6">
                  <small>{{ index + 1 }}</small>
                  <h1><span class="drawn-number badge badge-lg badge-primary">{{ item.number }}</span></h1>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Header from './results/header'
  import {db, drawnNumbersRef} from '../firebase'

  export default {
    firebase: {
      drawnNumbers: drawnNumbersRef
    },
    methods: {
      resetNumbers () {
        let vm = this
        while (vm.drawnNumbers.length > 0) {
          let key = vm.drawnNumbers[0]['.key']
          db.ref('drawnNumbers/' + key).remove()
        }
      },
      processCommand (params) {
        let vm = this
        switch (params.command) {
          case 'reset':
            vm.resetNumbers()
        }
      }
    },
    components: {
      myHeader: Header
    },
    data () {
      return {}
    },

    mounted: () => {

    }
  }
</script>

<style>
  .results-drawn-number {
    min-width: 60px;
  }

  .index-number {
    color: darkgray;
    position:absolute;
    left:5px;
    top:0;
  }
</style>
