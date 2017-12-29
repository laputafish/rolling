<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header">
              default Header
            </slot>
          </div>
          <div class="modal-body">
            <p>Are you sure?</p>
            <div class="form-group" v-if="code != ''">
              <label class="control-label">Code</label>
              <input type="text" class="form-control" v-model="inputCode">
            </div>
            <p class="text-left badge-notes p-2 badge badge-success" v-if="notes">{{ notes }}</p>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <button :disabled="code != '' && code !== inputCode" class="w-50 btn btn-danger modal-default-button" @click="$emit('ok')">Yes</button>
              <button class="w-50 btn btn-default modal-default-button" @click="$emit('close')">No</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  let $ = require('jquery')
  window.jQuery = $

  export default {
    props: ['msg', 'code', 'notes'],
    methods: {
      show: function () {

      }
    },
    data () {
      return {
        inputCode: ''
      }
    }
  }
</script>

<style>
  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
  }

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
  }

  .modal-container {
    width: 300px;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
  }

  .modal-header h3 {
    margin-top: 0;
    color: #42b983;
  }

  .modal-body {
    margin: 20px 0;
  }

  .modal-default-button {
    float: right;
  }

  /*
   * The following styles are auto-applied to elements with
   * transition="modal" when their visibility is toggled
   * by Vue.js.
   *
   * You can easily play with the modal transition by editing
   * these styles.
   */

  .modal-enter {
    opacity: 0;
  }

  .modal-leave-active {
    opacity: 0;
  }

  .badge-notes {
    max-width: 100%;
    white-space: normal;
  }

  .modal-enter .modal-container,
  .modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
</style>
