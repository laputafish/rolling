<template>
<div class="container">
  <div class="row">
    <div class="col-sm-10 col-md-8 col-lg-6 mx-auto">
      <ul class="list-group">
        <li class="list-group-item" v-for="number in drawnNumbers">
          <span class="badge badge-primary">{{ number }}</span>
        </li>
      </ul>
    </div>
  </div>
</div>
</template>

<script>
import {
  drawnNumbersRef
} from '../firebase'

export default {
  data () {
    return {

    }
  },
  firebase: {
    drawnNumbers: drawnNumbersRef
  },
  mounted: () => {
    alert('x')
  }
}
</script>

<style>

</style>
