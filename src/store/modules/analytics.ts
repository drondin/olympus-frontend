import Vue from 'vue';
import { COINGECKO_URL } from '@/helpers/constants';
import { ethers } from 'ethers';
import addresses from '@/helpers/addresses';
import { abi as ierc20Abi } from '@/helpers/abi/IERC20.json';
import { abi as PairContract } from '@/helpers/abi/PairContract.json';

const state = {
  circulatingSupply: null,
  maxSupply: null,
  marketCap: null,
  marketPrice: null,
  ohmTotalSupply: null,
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

  async getMarketPrice({ commit, rootState }) {
    const pairContract = new ethers.Contract(addresses[rootState.network.chainId].LP_ADDRESS, PairContract, rootState.provider);
    const reserves     = await pairContract.getReserves();
    const marketPrice  = reserves[1] / reserves[0];
    commit("set", { marketPrice: marketPrice / Math.pow(10, 9) })

    return marketPrice;
  },

  async getTokenSupply({ commit, rootState }) {
    const ohmContract    = new ethers.Contract(addresses[rootState.network.chainId].OHM_ADDRESS, ierc20Abi, rootState.provider);
    const ohmTotalSupply = await ohmContract.totalSupply();
    commit("set", { ohmTotalSupply })

    return ohmTotalSupply;
  }
};

export default {
  state,
  actions,
  mutations: {
    // Allows us to commit state directly from actions.
    set(_state, payload) {
      Object.keys(payload).forEach(key => {
        Vue.set(_state, key, payload[key]);
      });
    }
  }
};
