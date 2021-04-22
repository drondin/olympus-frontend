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
    address: null,
    network: {chainId: 1},
    provider: null,
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
    init: async ({ commit, dispatch, state, getters }) => {
      commit('set', { appLoading: true });

      let signer, address, network;
      const provider = await dispatch('getProvider');

      if (!provider) {
        console.error('This website require MetaMask');
      } else {
        signer  = provider.getSigner();
        network = await provider.getNetwork();
        try {
          address = await signer.getAddress();
        } catch (error) {
          console.log(error)
        }

        commit('set', { address, network });
      }

      // Calculate bond-level data.
      await dispatch('calcBondDetails', "");
      await dispatch('calcDaiBondDetails', "");

      if (address)
        await dispatch("loadAccountDetails");

      commit('set', { appLoading: false });
    },

    login: async () => {
      try {
        // @ts-ignore
        const enable = await window.ethereum.enable();
      } catch (error) {
        window.alert(error.message);
      }
    },

    disconnectWallet: ({ commit }) => {
      commit('set', {address: null})
    },

    getProvider: async ({ commit }) => {
      // @ts-ignore
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window['ethereum']);
        commit('set', { provider });
        return provider;
      }
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
