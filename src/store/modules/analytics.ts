import Vue from 'vue';
import { COINGECKO_URL } from '@/helpers/constants';

let provider;

const state = {
  loading: false,
  circulatingSupply: null,
  marketCap: null,
  currentPrice: null
};

// Defines convenience function set() that can be used to update key property
// with payload property.
// TODO: might be better to use mutation-types.js instead
// https://vuex.vuejs.org/guide/mutations.html#using-constants-for-mutation-types
const mutations = {
  set(_state, payload) {
    Object.keys(payload).forEach(key => {
      Vue.set(_state, key, payload[key]);
    });
  }
};

const actions = {
  loading: ({ commit }, payload) => {
    commit('set', { loading: payload });
  },
  async getExchangeRates({ commit }) {
    const exchangeRates = await getExchangeRatesFromCoinGecko();
    commit('set', { exchangeRates });
  },

  async getCoingeckoData() {
    const result = await fetch(COINGECKO_URL);
    const json   = await result.json();

    commit('set', {
      circulatingSupply: json.market_data.circulating_supply,
      marketCap: json.market_data.market_cap.usd,
      currentPrice: json.market_data.current_price.usd
    });
  }
};

export default {
  state,
  mutations,
  actions
};
