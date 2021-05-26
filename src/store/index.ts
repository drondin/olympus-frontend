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
    // Should only get called once when the app is created
    initProvider: async ({ dispatch }) => {
      // If there's already a window.provider we don't need to do any additional setup
      if (window.provider || window.provider != null) {
        return;
      }
      const localProviderName = providers.getLocalProviderName();
      if (!localProviderName || localProviderName === '') {
        return;
      }
      dispatch('setProvider', { providerName: localProviderName });
    },
    // Called to initialize the app after a provider is set
    init: async ({ commit, dispatch }) => {
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

    disconnectWallet: ({ commit }) => {
      providers.clearLocalProvider();
      commit('set', { address: null });
    },

    setProvider: async ({ dispatch }, { providerName }) => {
      console.log('providerName:', providerName);
      switch (providerName) {
        case 'metamask':
          await providers.metamask();
          break;
        case 'walletconnect':
          await providers.walletConnect();
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

export default store;
