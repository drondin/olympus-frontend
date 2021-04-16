import Vue from 'vue';
import { COINGECKO_URL } from '@/helpers/constants';

const state = {
  circulatingSupply: null,
  maxSupply: null,
  marketCap: null,
  currentPrice: null
};

const actions = {
  async getCoingeckoData({ commit }) {
    try {
      const result = await fetch(COINGECKO_URL);
      const json   = await result.json();

      Vue.set(state, 'circulatingSupply', json.market_data.circulating_supply);
      Vue.set(state, 'maxSupply', json.market_data.max_supply);
      Vue.set(state, 'marketCap', json.market_data.market_cap.usd);
      Vue.set(state, 'currentPrice', json.market_data.current_price.usd);
    } catch {
      Vue.set(state, 'circulatingSupply', null);
      Vue.set(state, 'maxSupply', null);
      Vue.set(state, 'marketCap', null);
      Vue.set(state, 'currentPrice', null);
    }

  },
};

export default {
  state,
  actions
};
