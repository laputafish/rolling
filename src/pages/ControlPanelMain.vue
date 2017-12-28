<template>
  <div class="container">
    <div class="row pt-3 my-3">
      <div class="col-5 ml-auto">
        <router-link
          tag="button"
          :to="'/panel'"
          class="btn btn-default btn-block">
          <h1><i class="fa fa-gear fa-fw"></i></h1>
          <p>Control Panel</p>
        </router-link>
      </div>
      <div class="col-5 mr-auto">
        <router-link
          tag="button"
          :to="'/settings'"
          class="btn btn-default btn-block">
          <h1><i class="fa fa-gear fa-fw"></i></h1>
          <p>Settings</p>
        </router-link>
      </div>
    </div>
    <div class="row pt-3">
      <div class="col-5 ml-auto">
        <router-link
          tag="button"
          :to="'/results'"
          class="btn btn-default btn-block">
          <h1><i class="fa fa-gift fa-fw"></i></h1>
          <p>Results</p>
        </router-link>
      </div>
      <div class="col-5 mr-auto">

      </div>
    </div>
  </div>
</template>
