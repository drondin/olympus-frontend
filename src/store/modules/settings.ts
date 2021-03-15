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
import { abi as OlympusStaking } from '@/helpers/abi/OlympusStaking.json';

const parseEther = ethers.utils.parseEther;

const ethereum = window['ethereum'];
if (ethereum) {
  ethereum.on('accountsChanged', () => store.dispatch('init'));
  ethereum.on('networkChanged', network => {
    store.commit('set', { network: ethers.utils.getNetwork(parseInt(network)) });
  });
}

const state = {  
  //pOlySaleAddr: '0xf1837904605Ee396CFcE13928b1800cE0AbF1357',
  daiAddr: '0x8887bbd1092802e80f5084d3d360911e25b9b487',
  ohmAddr: '0x8887bbd1092802e80f5084d3d360911e25b9b487',
  stakingAddr: '0x342f01b176E84e876D73EF3C5db9024cEfB244e1',
  sohmAddr: '0xe4911e147a6062ef4b9ba6e79e24a55e5191e412',
  approval: 0,
  OHMPresaleAddr: '0x90d1dd1fa2fddd5076850f342f31717a0556fdf7',  
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
  network: {},
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

        const ohmContract = new ethers.Contract(state.ohmAddr, ierc20Abi, provider);
        const ohmBalance = await ohmContract.balanceOf(address);
        const sohmContract = new ethers.Contract(state.sohmAddr, ierc20Abi, provider);
        const sohmBalance = await sohmContract.balanceOf(address);
        //const balance = balanceBefore.toFixed(2);        
        const network = await provider.getNetwork();
        const allowance = await daiContract.allowance(address, state.OHMPresaleAddr)!;
        const stakeAllowance = await ohmContract.allowance(address, state.stakingAddr)!;
        const unstakeAllowance = await sohmContract.allowance(address, state.stakingAddr)!;

        console.log("Allowance", allowance);
        console.log("stakeAllowance", stakeAllowance);
        dispatch('getAllotmentPerBuyer')
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

    const presaleTX = await presale.purchaseaOHM(ethers.utils.parseEther(value).toString());
    await presaleTX.wait(console.log("Success"));
    const balance = await daiContract.balanceOf(state.address);
    commit('set', {
      // name,
      balance: ethers.utils.formatEther(balance)})    
  },

  async getApproval({commit, dispatch}, value) {
    const signer = provider.getSigner();  
    const daiContract = await new ethers.Contract(state.daiAddr, ierc20Abi, signer);
    if(value <= 0) return;

    const approveTx = await daiContract.approve(state.OHMPresaleAddr, ethers.utils.parseEther(value).toString());
    commit('set',{allowanceTx:1})
    await approveTx.wait();
    await dispatch('getAllowances')

  },

  async getAllowances({commit}) {
    if(state.address) {
    const diaContract = await new ethers.Contract(state.daiAddr, ierc20Abi, provider);
    const allowance = await diaContract.allowance(state.address, state.OHMPresaleAddr);
    commit('set', {allowance});
    }
  },

  async getStakeApproval({commit, dispatch}, value) {
    const signer = provider.getSigner();  
    const ohmContract = await new ethers.Contract(state.ohmAddr, ierc20Abi, signer);
    if(value <= 0) return;

    const approveTx = await ohmContract.approve(state.stakingAddr, ethers.utils.parseUnits(value, 'gwei').toString());
    await approveTx.wait();
    await dispatch('getStakeAllowances')
  },

  async getStakeAllowances({commit}) {
    if(state.address) {
    const ohmContract = await new ethers.Contract(state.ohmAddr, ierc20Abi, provider);
    const stakeAllowance = await ohmContract.allowance(state.address, state.stakingAddr);
    commit('set', {stakeAllowance});
    }
  },
  async getunStakeApproval({commit, dispatch}, value) {
    const signer = provider.getSigner();  
    const sohmContract = await new ethers.Contract(state.sohmAddr, ierc20Abi, signer);
    if(value <= 0) return;

    const approveTx = await sohmContract.approve(state.stakingAddr, ethers.utils.parseUnits(value, 'gwei').toString());
    await approveTx.wait();
    await dispatch('getunStakeAllowances')
  },

  async getunStakeAllowances({commit}) {
    if(state.address) {
    const sohmContract = await new ethers.Contract(state.sohmAddr, ierc20Abi, provider);
    const unstakeAllowance = await sohmContract.allowance(state.address, state.stakingAddr);
    commit('set', {unstakeAllowance});
    }
  },  
  async calculateSaleQuote({commit}, value) {
      const presale = await new ethers.Contract(state.OHMPresaleAddr, OHMPreSale, provider);
      const amount = await presale.calculateSaleQuote(ethers.utils.parseUnits(value, 'ether'));
      commit('set', {amount:ethers.utils.formatUnits(amount.toString(), 'gwei').toString()});  
  },

  async getAllotmentPerBuyer({commit}) {
    const presale = await new ethers.Contract(state.OHMPresaleAddr, OHMPreSale, provider);
    const allotment = await presale.getAllotmentPerBuyer()
    commit('set', {allotment:ethers.utils.formatUnits(allotment, 'gwei')});
  },

  async getMaxPurchase({commit, dispatch}) {
      const presale = await new ethers.Contract(state.OHMPresaleAddr, OHMPreSale, provider);
      const salePrice = await presale.salePrice();
      const total = state.allotment * salePrice;    

      commit('set', {maxPurchase:ethers.utils.formatUnits(total.toString(), 'ether')})
  },

  async stakeOHM({commit}, value) {
    const signer = provider.getSigner();      
    const staking = await new ethers.Contract(state.stakingAddr, OlympusStaking, signer);

    const stakeTx = await staking.stakeOLY(ethers.utils.parseUnits(value, 'gwei'));
    await stakeTx.wait();
    const ohmContract = new ethers.Contract(state.ohmAddr, ierc20Abi, provider);
    const ohmBalance = await ohmContract.balanceOf(state.address);
    const sohmContract = new ethers.Contract(state.sohmAddr, ierc20Abi, provider);
    const sohmBalance = await sohmContract.balanceOf(state.address);   
    commit('set', {
      ohmBalance: ethers.utils.formatUnits(ohmBalance, 'gwei'),
      sohmBalance: ethers.utils.formatUnits(sohmBalance, 'gwei'),
    });          
  },
  async unstakeOHM({commit}, value) {
    const signer = provider.getSigner();      
    const staking = await new ethers.Contract(state.stakingAddr, OlympusStaking, signer);
    console.log(ethers.utils.parseUnits(value, 'gwei').toString())
    const stakeTx = await staking.unstakeOLY(ethers.utils.parseUnits(value, 'gwei'));
    await stakeTx.wait();
    const ohmContract = new ethers.Contract(state.ohmAddr, ierc20Abi, provider);
    const ohmBalance = await ohmContract.balanceOf(state.address);
    const sohmContract = new ethers.Contract(state.sohmAddr, ierc20Abi, provider);
    const sohmBalance = await sohmContract.balanceOf(state.address);   
    commit('set', {
      ohmBalance: ethers.utils.formatUnits(ohmBalance, 'gwei'),
      sohmBalance: ethers.utils.formatUnits(sohmBalance, 'gwei'),
    });          
  }  


  // Will buy the POly or approve if needed
 /* async SendDai({ commit }, payload ) {
    const signer = provider.getSigner();  

    const crowdSale = await new ethers.Contract(state.pOlySaleAddr, pOlyTokenSale, provider);
    const crowdSaleWithSigner = crowdSale.connect(signer);
          
    const daiContract = new ethers.Contract(state.daiAddr, ierc20Abi, provider);
    const daiContractWithSigner = daiContract.connect(signer);

    const allowance = await daiContract.allowance(state.address, state.pOlySaleAddr);
    console.log(allowance +":"+parseEther(payload.value).toString())
    if(allowance < parseEther( payload.value ).toString() && parseEther( payload.value ) <= parseEther('50000')){     
      console.log(parseEther( payload.value ).toString());
      const approveTx = await daiContractWithSigner.approve(state.pOlySaleAddr, parseEther((1e9).toString()));
      commit('set',{allowanceTx:1})
      await approveTx.wait(state.confirmations);       
    }

      // Removing limit on payment amount
    // else if(parseEther( payload.value ) > parseEther('50000')) {
    //   alert("Needs To Be Less Than 50,000 DAI");
    //   console.log("Needs To Be Less Than 50,000 DAI");
    // }
    
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
