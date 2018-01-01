import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
  strict: true,
  state: {
    panelKey: ''
  },
  mutations: {
    updatePanelKey (state, value) {
      console.log('store.js :: updatePanelKey value: ', value)
      console.log('store.js :: this.state: ', state)
      state.panelKey = value
    }
  }
})

export {store}
