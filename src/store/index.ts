import Vue from 'vue';
import Vuex from 'vuex';
import modules from './modules';
import { ethers } from 'ethers';

Vue.use(Vuex);

// store: {state: {}, constants: {}, settings: {}}
const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules,
  state: {
    appLoading: false,
    isSidebarExpanded: false,
    address: '',
    network: {chainId: 0},
    provider: null
  },
  mutations: {
    toggleSidebar(state, value) {
      state.isSidebarExpanded = value;
    },

    // Allows us to commit state directly from actions.
    set(_state, payload) {
      Object.keys(payload).forEach(key => {
        Vue.set(_state, key, payload[key]);
      });
    }
  },
  actions: {
    init: async ({ commit, dispatch, state }) => {
      commit('set', { appLoading: true });

      let provider;

      // @ts-ignore
      if (typeof window.ethereum !== 'undefined') {
        const ethereum = window['ethereum'];
        provider = new ethers.providers.Web3Provider(ethereum);
        commit('set', { provider });
      }

      if (provider) {
        try {
          await window.ethereum.enable()
          const signer  = provider.getSigner();
          const address = await signer.getAddress();
          commit('set', { address });

          const network = await provider.getNetwork();
          store.commit('set', { network });

          // Run the login script for the user.
          await dispatch("login");
        } catch (e) {
          alert(e.message);
        }
      } else {
        console.error('This website require MetaMask');
      }

      commit('set', { appLoading: false });
    }
  }
});



const ethereum = window['ethereum'];
if (ethereum) {
  ethereum.on('accountsChanged', () => {
    store.dispatch('init');
  })

  ethereum.on('networkChanged', network => {
    store.dispatch('init')
  });
}

export default store;
