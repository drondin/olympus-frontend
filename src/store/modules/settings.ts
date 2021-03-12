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
import { abi as pOlyTokenSale } from '@/helpers/abi/pOlyTokenSale.json';
import { abi as OHMPreSale } from '@/helpers/abi/OHMPreSale.json';

const parseEther = ethers.utils.parseEther;

const ethereum = window['ethereum'];
if (ethereum) {
  ethereum.on('accountsChanged', () => store.dispatch('init'));
  ethereum.on('networkChanged', network => {
    store.commit('set', { network: ethers.utils.getNetwork(parseInt(network)) });
  });
}

const state = {  
  pOlySaleAddr: '0xf1837904605Ee396CFcE13928b1800cE0AbF1357',
  daiAddr: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  approval: 0,
  OHMPresaleAddr: '',
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
  allowance: 0,
  balances: {},
  authorized: false,
  allowanceTx: 0,
  saleTx: 0,
  confirmations: 1,
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
        console.log('error address: '+address);
        // const name = await provider.lookupAddress(address);
        // Throws errors with non ENS compatible testnets
        const daiContract = new ethers.Contract(state.daiAddr, ierc20Abi, provider);
        const balance = await daiContract.balanceOf(address);
        //const balance = balanceBefore.toFixed(2);        
        const network = await provider.getNetwork();
        const allowance = await daiContract.allowance(address, state.OHMPresaleAddr)!;
        
        commit('set', { address });
        commit('set', {
          // name,
          balance: ethers.utils.formatEther(balance),
          network,
          loading: false
        });        
        commit('set', { allowance });
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

  async getOHM({commit}, value) {
    const signer = provider.getSigner();  
    const presale = await new ethers.Contract(state.OHMPresaleAddr, OHMPreSale, signer);
    const daiContract = new ethers.Contract(state.daiAddr, ierc20Abi, signer);

    const presaleTX = await presale.purchaseOHM(ethers.utils.parseEther(value).toString());
    await presaleTX.wait(console.log("Success"));
  },

  async getApproval({commit}, value) {
    const signer = provider.getSigner();  
    const daiContract = await new ethers.Contract(state.daiAddr, ierc20Abi, signer);
    if(value <= 0) return;

    const approveTx = await daiContract.approve(state.pOlySaleAddr, parseEther((1e9).toString()));
    commit('set',{allowanceTx:1})
    await approveTx.wait(state.confirmations);           

  },

  async getAllowances({commit}) {
    const diaContract = await new ethers.Contract(state.daiAddr, ierc20Abi, provider);
    const allowance = await diaContract.allowance(state.address, state.OHMPresaleAddr);
    commit('set', {allowance});
  },

  // Will buy the POly or approve if needed
 /* async SendDai({ commit }, payload ) {
    const signer = provider.getSigner();  

    const crowdSale = await new ethers.Contract(state.pOlySaleAddr, pOlyTokenSale, provider);
    const crowdSaleWithSigner = crowdSale.connect(signer);
          
    const daiContract = new ethers.Contract(state.daiAddr, ierc20Abi, provider);
    const daiContractWithSigner = daiContract.connect(signer);

    const allowance = await daiContract.allowance(state.address, state.pOlySaleAddr);
    console.log(allowance +":"+parseEther(payload.value).toString())
    if(allowance < parseEther( payload.value ).toString()){     
      const approveTx = await daiContractWithSigner.approve(state.pOlySaleAddr, parseEther((1e9).toString()));
      commit('set',{allowanceTx:1})
      await approveTx.wait(state.confirmations);           
    }
    
    commit('set',{allowanceTx:2})

    // We have approved funds. Now execute the buy function on Sale Contract.
    const purchaseAmnt = parseEther( payload.value )
    try {
      const saleTx = await crowdSaleWithSigner.buyPOly(purchaseAmnt);
      commit('set', {saleTx:1})
      await saleTx.wait(state.confirmations);
      commit('set', {saleTx:2, balance:state.balance-Number(payload.value)})
    } catch(error){
      console.log(error);
      commit('set',{ allowanceTx:0, saleTx:0 })
    }

//    if(allowance > 0) {      
//      await crowdSaleWithSigner.buyPoly((payload.value * (1e18)).toString());      
//    }
  }*/
};

export default {
  state,
  mutations,
  actions
};
