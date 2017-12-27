<template>
  <nav class="navbar fixed-top navbar-dark bg-dark">
    <div class="navbar-collapse collapse">
      <ul class="nav navbar-nav">
      </ul>
    </div>
    <a class="navbar-brand" href="#">Lottery Draw 2018</a>
    <ul class="nav navbar-nav ml-auto">
      <li class="nav-item">
        <button @click="reset" class="btn btn-primary " type="button"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <i class="fa fa-save"></i>&nbsp;Reset
        </button>
      </li>
    </ul>
  </nav>
</template>

<script>
  export default {
    methods: {
      reset () {
        this.$emit('commandHandler', {command: 'reset'})
      }
    }
  }
</script>
