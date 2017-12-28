<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <a class="navbar-brand" href="#">Lottery 2018</a>
    <!-- <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button> -->

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
      </ul>
      <ul class="navbar-nav ml-auto">
        <router-link
          tag="li"
          :to="'/cp/panel'"
          class="nav-item"
          active-class="active"
          exact>
          <a class="nav-link">Control Panel</a>
        </router-link>
        <router-link
          tag="li"
          :to="'/cp/settings'"
          class="nav-item"
          active-class="active"
          exact>
          <a class="nav-link">Settings</a>
        </router-link>
        <router-link
          tag="li"
          :to="'/cp/results'"
          class="nav-item"
          active-class="active"
          exact>
          <a class="nav-link">Results</a>
        </router-link>
      </ul>
    </div>
  </nav>
</template>

<script>
  export default {

  }
</script>
