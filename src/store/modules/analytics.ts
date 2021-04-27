import Vue from 'vue';
import { COINGECKO_URL, EPOCH_INTERVAL, BLOCK_RATE_SECONDS } from '@/helpers/constants';
import { ethers } from 'ethers';
import addresses from '@/helpers/addresses';
import { abi as ierc20Abi } from '@/helpers/abi/IERC20.json';
import { abi as PairContract } from '@/helpers/abi/PairContract.json';
import { abi as BondContract } from '@/helpers/abi/BondContract.json';
import { abi as BondCalcContract } from '@/helpers/abi/BondCalcContract.json';
import { abi as DaiBondContract } from '@/helpers/abi/DaiBondContract.json';

const state = {
  circulatingSupply: null,
  maxSupply: null,
  marketCap: null,
  marketPrice: null,
  ohmTotalSupply: null,
  currentPrice: null,
  daiBond: {}
};

const actions = {
  async getCoingeckoData({ commit }) {
    try {
      const result = await fetch(COINGECKO_URL);
      const json = await result.json();

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

  async secondsUntilRebase({ rootState }) {
    // NOTE: This will modify provider which is part of Vuex store. You'll
    // see Error: [vuex] do not mutate vuex store state outside mutation handlers.
    const height = await rootState.provider.getBlockNumber();

    if (height % EPOCH_INTERVAL === 0) {
      return 0;
    }

    const next = height + EPOCH_INTERVAL - (height % EPOCH_INTERVAL);
    const blocksAway = next - height;
    const secondsAway = blocksAway * BLOCK_RATE_SECONDS;

    return secondsAway;
  },

  // Uses PairContract
  async getMarketPrice({ commit, rootState }) {
    const pairContract = new ethers.Contract(
      addresses[rootState.network.chainId].LP_ADDRESS,
      PairContract,
      rootState.provider
    );
    const reserves = await pairContract.getReserves();
    const marketPrice = reserves[1] / reserves[0];

    commit('set', { marketPrice: marketPrice / Math.pow(10, 9) });
    return marketPrice;
  },

  async getTokenSupply({ commit, rootState }) {
    const ohmContract = new ethers.Contract(
      addresses[rootState.network.chainId].OHM_ADDRESS,
      ierc20Abi,
      rootState.provider
    );
    const ohmTotalSupply = await ohmContract.totalSupply();
    commit('set', { ohmTotalSupply });

    return ohmTotalSupply;
  },

  async calculateUserBondDetails({ commit, rootState }) {
    if (!rootState.address) return;

    // Calculate bond details.
    const bondingContract = new ethers.Contract(
      addresses[rootState.network.chainId].BOND_ADDRESS,
      BondContract,
      rootState.provider
    );
    const bondDetails = await bondingContract.depositorInfo(rootState.address);
    const interestDue = bondDetails[1];
    const bondMaturationBlock = +bondDetails[3] + +bondDetails[2];
    const pendingPayout = await bondingContract.calculatePendingPayout(rootState.address);

    console.log('Calculated user DAI bond data: ', {
      bondMaturationBlock,
      pendingPayout,
      interestDue
    });

    commit('set', {
      interestDue: ethers.utils.formatUnits(interestDue, 'gwei'),
      bondMaturationBlock,
      pendingPayout: ethers.utils.formatUnits(pendingPayout, 'gwei')
    });
  },

  async calcBondDetails({ commit, dispatch, rootState }, amount) {
    let amountInWei;
    if (!amount || amount === '') {
      amountInWei = ethers.utils.parseEther('0.0001'); // Use a realistic SLP ownership
    } else {
      amountInWei = ethers.utils.parseEther(amount);
    }
    const pairContract = new ethers.Contract(
      addresses[rootState.network.chainId].LP_ADDRESS,
      PairContract,
      rootState.provider
    );
    // If the user hasn't entered anything, let's calculate a fraction of SLP
    const bondingContract = new ethers.Contract(
      addresses[rootState.network.chainId].BOND_ADDRESS,
      BondContract,
      rootState.provider
    );
    const lpContract = new ethers.Contract(
      addresses[rootState.network.chainId].LP_ADDRESS,
      ierc20Abi,
      rootState.provider
    );
    const bondingCalcContract = new ethers.Contract(
      addresses[rootState.network.chainId].BONDINGCALC_ADDRESS,
      BondCalcContract,
      rootState.provider
    );

    const totalLP = await lpContract.totalSupply();
    const ohmTotalSupply = await dispatch('getTokenSupply', null, { root: true });

    const vestingPeriodInBlocks = await bondingContract.vestingPeriodInBlocks();

    const totalDebtDo = await bondingContract.totalDebt();
    const debtRatio = await bondingCalcContract.calcDebtRatio(totalDebtDo, ohmTotalSupply);
    const marketPrice = await dispatch('getMarketPrice');

    const reserves = await pairContract.getReserves();
    const bondValue = await bondingContract.calculateBondInterest(amountInWei.toString());
    const bondPrice = (2 * reserves[1] * (amountInWei / totalLP)) / bondValue;
    const bondDiscount = 1 - bondPrice / marketPrice;

    commit('set', {
      amount,
      bondValue,
      bondDiscount,
      debtRatio,
      bondPrice: bondPrice / Math.pow(10, 9),
      vestingPeriodInBlocks,
      marketPrice: marketPrice / Math.pow(10, 9)
    });
  },

  async calculateUserDaiBondDetails({ commit, rootState }) {
    if (!rootState.address) return;

    const daiBondContract = new ethers.Contract(
      addresses[rootState.network.chainId].DAI_BOND_ADDRESS,
      DaiBondContract,
      rootState.provider
    );
    const daiContract = new ethers.Contract(
      addresses[rootState.network.chainId].DAI_ADDRESS,
      ierc20Abi,
      rootState.provider
    );
    const bondingCalcContract = new ethers.Contract(
      addresses[rootState.network.chainId].BONDINGCALC_ADDRESS,
      BondCalcContract,
      rootState.provider
    );

    const bondDetails = await daiBondContract.depositorInfo(rootState.address);
    const interestDue = bondDetails[1];
    const bondMaturationBlock = +bondDetails[3] + +bondDetails[2];
    const pendingPayout = await daiBondContract.calculatePendingPayout(rootState.address);

    console.log('Calculated user DAI bond data: ', {
      bondMaturationBlock,
      pendingPayout,
      interestDue
    });

    const bondData = state.daiBond || {};

    commit('set', {
      daiBond: {
        ...bondData,
        interestDue: ethers.utils.formatUnits(interestDue, 'gwei'),
        bondMaturationBlock: bondMaturationBlock,
        pendingPayout: ethers.utils.formatUnits(pendingPayout, 'gwei')
      }
    });
  },

  async calcDaiBondDetails({ dispatch, commit, rootState }, amount) {
    let amountInWei;
    if (!amount || amount === '') {
      amountInWei = ethers.utils.parseEther('1000'); // Assume average person puts in 1K DAI
    } else {
      amountInWei = ethers.utils.parseEther(amount.toString());
    }

    const daiBondContract = new ethers.Contract(
      addresses[rootState.network.chainId].DAI_BOND_ADDRESS,
      DaiBondContract,
      rootState.provider
    );
    const daiContract = new ethers.Contract(
      addresses[rootState.network.chainId].DAI_ADDRESS,
      ierc20Abi,
      rootState.provider
    );
    const bondingCalcContract = new ethers.Contract(
      addresses[rootState.network.chainId].BONDINGCALC_ADDRESS,
      BondCalcContract,
      rootState.provider
    );

    const marketPrice = await dispatch('getMarketPrice');
    const bondValue = await daiBondContract.calculateBondInterest(amountInWei.toString());
    const bondPrice = amountInWei / bondValue;
    const discount = 1 - bondPrice / (marketPrice / 1000000000);

    const vestingPeriodInBlocks = await daiBondContract.vestingPeriodInBlocks();
    const ohmTotalSupply = await dispatch('getTokenSupply', null, { root: true });
    const totalDebtDo = await daiBondContract.totalDebt();
    const debtRatio = await bondingCalcContract.calcDebtRatio(totalDebtDo, ohmTotalSupply);

    console.log('Calculated DAI Bond data: ', {
      amountInWei: amountInWei.toString(),
      marketPrice,
      bondPrice,
      discount,
      bondValue: bondValue.toString()
    });

    commit('set', {
      daiBond: {
        value: bondValue,
        price: bondPrice,
        discount,
        marketPrice: marketPrice / Math.pow(10, 9),
        debtRatio,
        vestingPeriodInBlocks
      }
    });
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
