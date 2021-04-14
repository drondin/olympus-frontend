import Vue from 'vue';
import Vuex from 'vuex';
import modules from './modules';

Vue.use(Vuex);

// store: {state: {}, constants: {}, settings: {}}
const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules,
  state: {
    isSidebarExpanded: false
  },
  mutations: {
    toggleSidebar(state, value) {
      state.isSidebarExpanded = value;
    }
  }
});

export default store;
