import Vue from 'vue';
import { ethers } from 'ethers';
import store from '@/store';
import provider from '@/helpers/provider';
import {
  getExchangeRatesFromCoinGecko,
  getPotions,
  getAllowances,
  revitalisePotion,
  withdrawPotion
} from '@/helpers/utils';
import assets from '@/helpers/assets.json';
import { abi as ierc20Abi } from '@/helpers/abi/IERC20.json';
import { abi as mimirTokenSale } from '@/helpers/abi/mimirTokenSale.json';

const parseEther = ethers.utils.parseEther;

const ethereum = window['ethereum'];
if (ethereum) {
  ethereum.on('accountsChanged', () => store.dispatch('init'));
  ethereum.on('networkChanged', network => {
    store.commit('set', { network: ethers.utils.getNetwork(parseInt(network)) });
  });
}

const state = {
  saleAddr: '0xb72027693a5b717b9e28ea5e12ec59b67c944df7',
  pOlySaleAddr: '',
  daiAddr: '0x6b175474e89094c44da98b954eedeac495271d0f',
  loading: false,
  address: null,
  name: '',
  balance: 0,
  claim: 0,
  minimumEth: 0,
  providedEth: 0,
  remainingEth: 0,
  network: {},
  exchangeRates: {},
  allowances: {},
  balances: {}
};

const mutations = {
  set(_state, payload) {
    Object.keys(payload).forEach(key => {
      Vue.set(_state, key, payload[key]);
    });
  }
};

const actions = {
  init: async ({ commit, dispatch }) => {
    commit('set', { loading: true });
    await dispatch('getExchangeRates');
    if (provider) {
      try {
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        if (address) await dispatch('login');
      } catch (e) {
        console.log(e);
      }
    }
    commit('set', { loading: false });
  },
  login: async ({ commit, dispatch }) => {
    if (provider) {
      try {
        await ethereum.enable();
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const name = await provider.lookupAddress(address);
        const daiContract = new ethers.Contract('0x6b175474e89094c44da98b954eedeac495271d0f', ierc20Abi, provider);
        const balance = await daiContract.balanceOf(address);
        //const balance = await provider.getBalance(address);
        const network = await provider.getNetwork();
        commit('set', { address });
        commit('set', {
          name,
          balance: ethers.utils.formatEther(balance),
          network,
          loading: false
        });
        await dispatch('calculateRemainingEther');
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('This website require MetaMask');
    }
  },
  loading: ({ commit }, payload) => {
    commit('set', { loading: payload });
  },
  async getExchangeRates({ commit }) {
    const exchangeRates = await getExchangeRatesFromCoinGecko();
    commit('set', { exchangeRates });
  },

  async SendEther({ commit }, payload) {
    const crowdSale = await new ethers.Contract(state.saleAddr, mimirTokenSale, provider);
    const signer = provider.getSigner();

    alert((payload.value * (1e18) ).toString());
    //await signer.sendTransaction({
      //to: crowdSale.address,
      //value: ethers.utils.parseEther(payload.value.toString())
    //});
  },
  
  // Will buy the POly or approve if needed
  async SendDai({ commit }, payload ) {
    const signer = provider.getSigner();  

    const crowdSale = await new ethers.Contract(state.saleAddr, mimirTokenSale, provider);
    const crowdSaleWithSigner = crowdSale.connect(signer);
      
    //const sale = await new ethers.Contract(state.pOlySaleAddr, pOlySale, provider);
    const daiContract = new ethers.Contract('0x6b175474e89094c44da98b954eedeac495271d0f', ierc20Abi, provider);
    const daiContractWithSigner = daiContract.connect(signer);

    const allowance = await daiContract.allowance(state.address, state.saleAddr);

    if(allowance == 0){
      alert("approve " + parseEther((1e9).toString()));
      await daiContractWithSigner.approve(state.saleAddr, parseEther((1e9).toString()));      
    }

    if(allowance > 0) {
      alert((payload.value * (1e18) ).toString() + " oly"); 
      await crowdSaleWithSigner.buyPoly((payload.value * (1e18)).toString());      
    }

    //await daiContract.approve(state.pOlySaleAddr, parseEther((1e9).toString()));

    //alert((payload.value * (1e18) ).toString() + " oly");     
    //await sale.buyPOly((payload.value * (1e18) ).toString());
  },

  async calculateRemainingEther({ commit }) {
    const crowdSale = await new ethers.Contract(state.saleAddr, mimirTokenSale, provider);
    const minimumEth = await crowdSale.MINIMAL_PROVIDE_AMOUNT();
    const providedEth = await provider.getBalance(state.saleAddr);
    const remainingEth = minimumEth - providedEth;
    commit('set', {
      remainingEth: ethers.utils.formatEther(remainingEth.toString()),
      minimumEth: ethers.utils.formatEther(minimumEth),
      providedEth: ethers.utils.formatEther(providedEth)
    });
  },
};

export default {
  state,
  mutations,
  actions
};
