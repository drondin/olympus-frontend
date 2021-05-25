import Vue from 'vue';
import Vuex from 'vuex';
import modules from './modules';
import addresses from '@/helpers/addresses';
import providers from '@/helpers/provider';

Vue.use(Vuex);

// store: {state: {}, constants: {}, settings: {}}
const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules,
  state: {
    appLoading: false,
    toasts: [],
    isSidebarExpanded: false,
    address: null,
    network: { chainId: 1 },
    provider: null
  },

  mutations: {
    toggleSidebar(state, value) {
      state.isSidebarExpanded = value;
    },

    removeToast(state, toast) {
      state.toasts = state.toasts.filter(t => t['uuid'] !== toast.uuid);
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
      // TODO: this method is called when the app loads, but now we shortcircuit.
      //    Whats the intended behavior here?
      //    currently requires you to reselect the provider :bigthonk:
      if (!window.provider || window.provider == null) {
        return console.error('provider not set!');
      }

      commit('set', { appLoading: true });

      const provider = window.provider;

      // @ts-ignore Complains that provider can be null, but thats not possible.
      const signer = provider.getSigner();
      // @ts-ignore Complains that provider can be null, but thats not possible.
      const network = await provider.getNetwork();

      let address;
      try {
        address = await signer.getAddress();
      } catch (error) {
        console.log(error);
      }

      commit('set', { address, network });

      if (addresses[network.chainId]) {
        dispatch('calcBondDetails', '');
        dispatch('calcDaiBondDetails', '');
        dispatch('calcStakeDetails');
      }

      if (address) {
        dispatch('loadAccountDetails');
      }

      commit('set', { appLoading: false });
    },

    login: async () => {
      try {
        // @ts-ignore
        await window.ethereum.enable();
      } catch (error) {
        window.alert(error.message);
      }
    },

    disconnectWallet: ({ commit }) => {
      commit('set', { address: null, provider: null });
    },

    setProvider: async({ commit, dispatch }, { providerName }) => {
      let provider;
      console.log('providerName:', providerName)
      switch (providerName) {
        case 'metamask':
          window.provider = await providers.metamask();
          break;
        case 'walletconnect':
          window.provider = await providers.walletConnect();
          break;
        default:
          console.error('not a valid provider: ', providerName);
          return;
      }

      // Run the init method after we've setup our wallet provider
      dispatch('init');
    }
  }
});

const ethereum = window['ethereum'];
if (ethereum) {
  ethereum.on('accountsChanged', () => {
    store.dispatch('init');
  });

  ethereum.on('networkChanged', () => {
    store.dispatch('init');
  });
}

// TODO: this is a stopgap solution to access to provider across the codebase. Pls remove when refactoring. 
// Declare provider on the window global. 
declare global {
  interface Window { provider: any; }
}

export default store;
