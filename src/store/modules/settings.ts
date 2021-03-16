import Vue from 'vue';
import { ethers } from 'ethers';
import store from '@/store';
//import provider from '@/helpers/provider';
import addresses from '@/helpers/addresses';
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
import { abi as OlympusStaking } from '@/helpers/abi/OlympusStaking.json';

const parseEther = ethers.utils.parseEther;

let provider;

const ethereum = window['ethereum'];
if (ethereum) {
  ethereum.on('accountsChanged', () => store.dispatch('init'));
  ethereum.on('networkChanged', network => {
    
    store.dispatch('init')     
  });
}

const state = {  
  approval: 0,
  loading: false,
  address: null,
  name: '',
  balance: 0,
  ohmBalance: 0,
  claim: 0,
  minimumEth: 0,
  providedEth: 0,
  amount: 0,
  remainingEth: 0,
  network: {chainId: 0},
  exchangeRates: {},
  allowance: 0,
  stakeAllowance: 0,
  unstakeAllowance: 0,
  balances: {},
  authorized: false,
  allowanceTx: 0,
  saleTx: 0,
  confirmations: 1,
  allotment: 0,
  maxPurchase: 0,
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
    // @ts-ignore
    if (typeof window.ethereum !== 'undefined') {
      const ethereum = window['ethereum'];
      provider = new ethers.providers.Web3Provider(ethereum);
    }

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
        provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        console.log('error address: '+address);
        // const name = await provider.lookupAddress(address);
        // Throws errors with non ENS compatible testnets
        const network = await provider.getNetwork();
        console.log(network.chainId)
        store.commit('set', { network: network});        
        
        let ohmContract, ohmBalance=0, allowance=0;
        let sohmContract, sohmBalance=0, stakeAllowance=0, unstakeAllowance=0;

        const daiContract = new ethers.Contract(addresses[network.chainId].DAI_ADDRESS, ierc20Abi, provider);
        const balance = await daiContract.balanceOf(address);
        allowance = await daiContract.allowance(address, addresses[network.chainId].PRESALE_ADDRESS)!;

        if(addresses[network.chainId].OHM_ADDRESS) {
          ohmContract = new ethers.Contract(addresses[network.chainId].OHM_ADDRESS, ierc20Abi, provider);
          ohmBalance = await ohmContract.balanceOf(address);
          stakeAllowance = await ohmContract.allowance(address, addresses[network.chainId].STAKING_ADDRESS)!;
        }          
        if(addresses[network.chainId].SOHM_ADDRESS) {        
          sohmContract = new ethers.Contract(addresses[network.chainId].SOHM_ADDRESS, ierc20Abi, provider);
          sohmBalance = await sohmContract.balanceOf(address);
          unstakeAllowance = await sohmContract.allowance(address, addresses[network.chainId].STAKING_ADDRESS)!;
        }
        //const balance = balanceBefore.toFixed(2);        
        console.log("Allowance", allowance);
        console.log("stakeAllowance", stakeAllowance);

        commit('set', { address });
        commit('set', {
          // name,
          balance: ethers.utils.formatEther(balance),
          network,
          loading: false,
          ohmBalance: ethers.utils.formatUnits(ohmBalance, 'gwei'),
          sohmBalance: ethers.utils.formatUnits(sohmBalance, 'gwei'),
        });        
        commit('set', { allowance, stakeAllowance, unstakeAllowance });
        dispatch('getAllotmentPerBuyer');
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
    const presale = await new ethers.Contract(addresses[state.network.chainId].PRESALE_ADDRESS, OHMPreSale, signer);
    const daiContract = new ethers.Contract(addresses[state.network.chainId].DAI_ADDRESS, ierc20Abi, signer);

    const presaleTX = await presale.purchaseaOHM(ethers.utils.parseEther(value).toString());
    await presaleTX.wait(console.log("Success"));
    const balance = await daiContract.balanceOf(state.address);
    commit('set', {
      // name,
      balance: ethers.utils.formatEther(balance)})    
  },

  async getApproval({commit, dispatch}, value) {
    const signer = provider.getSigner();  
    const daiContract = await new ethers.Contract(addresses[state.network.chainId].DAI_ADDRESS, ierc20Abi, signer);
    if(value <= 0) return;

    const approveTx = await daiContract.approve(addresses[state.network.chainId].PRESALE_ADDRESS, ethers.utils.parseEther(value).toString());
    commit('set',{allowanceTx:1})
    await approveTx.wait();
    await dispatch('getAllowances')

  },

  async getAllowances({commit}) {
    if(state.address) {
    const diaContract = await new ethers.Contract(addresses[state.network.chainId].DAI_ADDRESS, ierc20Abi, provider);
    const allowance = await diaContract.allowance(state.address, addresses[state.network.chainId].PRESALE_ADDRESS);
    commit('set', {allowance});
    }
  },

  async getStakeApproval({commit, dispatch}, value) {
    const signer = provider.getSigner();  
    const ohmContract = await new ethers.Contract(addresses[state.network.chainId].OHM_ADDRESS, ierc20Abi, signer);
    if(value <= 0) return;

    const approveTx = await ohmContract.approve(addresses[state.network.chainId].STAKING_ADDRESS, ethers.utils.parseUnits(value, 'gwei').toString());
    await approveTx.wait();
    await dispatch('getStakeAllowances')
  },

  async getStakeAllowances({commit}) {
    if(state.address) {
    const ohmContract = await new ethers.Contract(addresses[state.network.chainId].OHM_ADDRESS, ierc20Abi, provider);
    const stakeAllowance = await ohmContract.allowance(state.address, addresses[state.network.chainId].STAKING_ADDRESS);
    commit('set', {stakeAllowance});
    }
  },
  async getunStakeApproval({commit, dispatch}, value) {
    const signer = provider.getSigner();  
    const sohmContract = await new ethers.Contract(addresses[state.network.chainId].SOHM_ADDRESS, ierc20Abi, signer);
    if(value <= 0) return;

    const approveTx = await sohmContract.approve(addresses[state.network.chainId].STAKING_ADDRESS, ethers.utils.parseUnits(value, 'gwei').toString());
    await approveTx.wait();
    await dispatch('getunStakeAllowances')
  },

  async getunStakeAllowances({commit}) {
    if(state.address) {
    const sohmContract = await new ethers.Contract(addresses[state.network.chainId].SOHM_ADDRESS, ierc20Abi, provider);
    const unstakeAllowance = await sohmContract.allowance(state.address, addresses[state.network.chainId].STAKING_ADDRESS);
    commit('set', {unstakeAllowance});
    }
  },  
  async calculateSaleQuote({commit}, value) {
      const presale = await new ethers.Contract(addresses[state.network.chainId].PRESALE_ADDRESS, OHMPreSale, provider);
      const amount = await presale.calculateSaleQuote(ethers.utils.parseUnits(value, 'ether'));
      commit('set', {amount:ethers.utils.formatUnits(amount.toString(), 'gwei').toString()});  
  },

  async getAllotmentPerBuyer({commit}) {
    const presale = await new ethers.Contract(addresses[state.network.chainId].PRESALE_ADDRESS, OHMPreSale, provider);
    const allotment = await presale.getAllotmentPerBuyer()
    commit('set', {allotment:ethers.utils.formatUnits(allotment, 'gwei')});
  },

  async getMaxPurchase({commit, dispatch}) {
      const presale = await new ethers.Contract(addresses[state.network.chainId].PRESALE_ADDRESS, OHMPreSale, provider);
      const salePrice = await presale.salePrice();
      const total = state.allotment * salePrice;    

      commit('set', {maxPurchase:ethers.utils.formatUnits(total.toString(), 'ether')})
  },

  async stakeOHM({commit}, value) {
    const signer = provider.getSigner();      
    const staking = await new ethers.Contract(addresses[state.network.chainId].STAKING_ADDRESS, OlympusStaking, signer);

    const stakeTx = await staking.stakeOLY(ethers.utils.parseUnits(value, 'gwei'));
    await stakeTx.wait();
    const ohmContract = new ethers.Contract(addresses[state.network.chainId].OHM_ADDRESS, ierc20Abi, provider);
    const ohmBalance = await ohmContract.balanceOf(state.address);
    const sohmContract = new ethers.Contract(addresses[state.network.chainId].SOHM_ADDRESS, ierc20Abi, provider);
    const sohmBalance = await sohmContract.balanceOf(state.address);   
    commit('set', {
      ohmBalance: ethers.utils.formatUnits(ohmBalance, 'gwei'),
      sohmBalance: ethers.utils.formatUnits(sohmBalance, 'gwei'),
    });          
  },
  async unstakeOHM({commit}, value) {
    const signer = provider.getSigner();      
    const staking = await new ethers.Contract(addresses[state.network.chainId].STAKING_ADDRESS, OlympusStaking, signer);
    console.log(ethers.utils.parseUnits(value, 'gwei').toString())
    const stakeTx = await staking.unstakeOLY(ethers.utils.parseUnits(value, 'gwei'));
    await stakeTx.wait();
    const ohmContract = new ethers.Contract(addresses[state.network.chainId].OHM_ADDRESS, ierc20Abi, provider);
    const ohmBalance = await ohmContract.balanceOf(state.address);
    const sohmContract = new ethers.Contract(addresses[state.network.chainId].SOHM_ADDRESS, ierc20Abi, provider);
    const sohmBalance = await sohmContract.balanceOf(state.address);   
    commit('set', {
      ohmBalance: ethers.utils.formatUnits(ohmBalance, 'gwei'),
      sohmBalance: ethers.utils.formatUnits(sohmBalance, 'gwei'),
    });          
  }  
};

export default {
  state,
  mutations,
  actions
};
