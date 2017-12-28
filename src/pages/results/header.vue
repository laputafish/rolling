<template>
  <nav class="navbar fixed-top navbar-dark bg-dark">
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
    <ul class="nav navbar-nav mr-auto">
      <li class="nav-item">
        <router-link tag="button" :to="'/cp'" class="btn btn-default" type="button"
                     aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <i class="fa fa-reply"></i>&nbsp;Back
        </router-link>
      </li>
    </ul>
    <a class="navbar-brand mx-auto" href="#">Lottery 2018</a>
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
  import ConfirmDelete from '../../components/common/ConfirmDelete'

  export default {
    components: {
      confirmDelete: ConfirmDelete
    },
    methods: {
      confirm () {
        let vm = this
        vm.showModal = false
        this.$emit('commandHandler', {command: vm.command})
      },
      onButtonClick () {
        let vm = this
        if (vm.useCode) {
          vm.showModal = true
        } else {
          this.$emit('commandHandler', {command: vm.command})
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
