<template>
  <nav class="my-header navbar fixed-top navbar-dark bg-dark">
    <confirm-delete
      v-if="showModal"
      ref="modal"
      :code="code"
      :notes="notes"
      @ok="confirm"
      @close="showModal = false">
      <div slot="header">
        <h1>Confirmation</h1>
      </div>
    </confirm-delete>
    <!--<ul class="nav navbar-nav mr-auto">-->
      <!--<li class="nav-item">-->
        <!--<router-link tag="button" :to="'/cp'" class="btn btn-default" type="button"-->
                     <!--aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">-->
          <!--<i class="fa fa-reply"></i>&nbsp;Back-->
        <!--</router-link>-->
      <!--</li>-->
    <!--</ul>-->
    <a class="navbar-brand" :class="{'mx-auto':command=='','mr-auto':command!==''}" href="#">Lottery Draw
2018</a>
    <ul class="nav navbar-nav ml-auto">
      <li class="nav-item">
        <button v-if="command" @click="onButtonClick" class="btn btn-primary " type="button"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <i class="fa " :class="icon"></i>&nbsp;{{ commandLabel }}
        </button>
      </li>
    </ul>
  </nav>
</template>

<script>
  import ConfirmDelete from './ConfirmDelete'

  export default {
    components: {
      confirmDelete: ConfirmDelete
    },
    methods: {
      confirm () {
        let vm = this
        vm.showModal = false
        if (!vm.useCode) {
          vm.code = ''
        }
        this.$emit('commandHandler', {command: vm.command})
      },
      onButtonClick () {
        let vm = this
        if (vm.useCustomDialog) {
          this.$emit('commandHandler', {command: vm.command})
        } else {
          vm.showModal = true
        }
      }
    },
    props: {
      command: {
        type: String,
        default: ''
      },
      commandLabel: {
        type: String,
        default: ''
      },
      icon: {
        type: String,
        default: 'fa-gear'
      },
      useCode: {
        type: Boolean,
        default: false
      },
      code: {
        type: String,
        default: ''
      },
      notes: {
        type: String,
        default: ''
      },
      useCustomDialog: {
        type: Boolean,
        default: null
      }
    },
    data () {
      return {
        deleteMsg: 'Are you sure?',
        showModal: false
      }
    }
  }
</script>

<style>
  .my-header.navbar {
    padding-right: .5rem;
  }
</style>
