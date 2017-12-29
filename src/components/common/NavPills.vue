<template>
  <ul class="nav nav-pills nav-fill fixed-bottom">
    <router-link
      :to="'/cp/panel'"
      tag="li"
      class="nav-item py-2 col-4"
      active-class="active">
      Panel
    </router-link>
    <router-link
      :to="'/cp/results'"
      tag="li"
      class="nav-item py-2 col-4"
      active-class="active">
      Results
    </router-link>
    <router-link
      :to="'/cp/settings'"
      tag="li"
      class="nav-item py-2 col-4"
      active-class="active">
      Settings
    </router-link>
  </ul>
</template>

<style>
.nav-pills .nav-item {
  background-color: #EEE;
  color: black;
}
.nav-pills {
  margin-top: 55px;
}
/*.nav-pills .nav-item a {*/
  /*color: darkgray;*/
/*}*/
/*.nav-pills .nav-item a:hover {*/
  /*text-decoration: none;*/
/*}*/
.nav-pills .nav-item:hover {
  background-color: #DDDDDD;
  cursor: pointer;
}
.nav-pills .nav-item.active {
  background-color: darkgray;
  color: white;
}
/*.nav-pills .nav-item.active a {*/
  /*color: black;*/
/*}*/
</style>
