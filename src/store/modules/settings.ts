import Vue from 'vue';
import { ethers } from 'ethers';
import store from '@/store';
//import provider from '@/helpers/provider';
import addresses from '@/helpers/addresses';
import { EPOCH_INTERVAL, BLOCK_RATE_SECONDS } from '@/helpers/constants';
import assets from '@/helpers/assets.json';
import analytics from '@/store/modules/analytics';
import { abi as ierc20Abi } from '@/helpers/abi/IERC20.json';
import { abi as OHMPreSale } from '@/helpers/abi/OHMPreSale.json';
import { abi as OlympusStaking } from '@/helpers/abi/OlympusStaking.json';
import { abi as MigrateToOHM } from '@/helpers/abi/MigrateToOHM.json';
import { abi as sOHM } from '@/helpers/abi/sOHM.json';
import { abi as LPStaking } from '@/helpers/abi/LPStaking.json';
import { abi as DistributorContract } from '@/helpers/abi/DistributorContract.json';
import { abi as BondContract } from '@/helpers/abi/BondContract.json';
import { abi as DaiBondContract } from '@/helpers/abi/DaiBondContract.json';
import { abi as BondCalcContract } from '@/helpers/abi/BondCalcContract.json';
import { abi as PairContract } from '@/helpers/abi/PairContract.json';

import { whitelist } from '@/helpers/whitelist.json';
const parseEther = ethers.utils.parseEther;

let provider, network, address;

async function getNextEpoch(): Promise<[number, number, number]> {
  // NOTE: This will modify provider which is part of Vuex store. You'll
  // see Error: [vuex] do not mutate vuex store state outside mutation handlers.
  const height = await provider.getBlockNumber();

  if (height % EPOCH_INTERVAL === 0) {
    return [0, 0, 0];
  }

  const next = height + EPOCH_INTERVAL - (height % EPOCH_INTERVAL);
  const blocksAway = next - height;
  const secondsAway = blocksAway * BLOCK_RATE_SECONDS;

  return [next, blocksAway, secondsAway];
}

const state = {
  approval: 0,
  loading: false,
  name: '',
  whitelisted: false,
  balance: 0,
  ohmBalance: 0,
  claim: 0,
  minimumEth: 0,
  providedEth: 0,
  amount: '',
  remainingEth: 0,
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
  maxSwap: 0,
  amountSwap: 0,
  epochBlock: null,
  epochBlocksAway: null,
  epochSecondsAway: null,

  daiBond: {}
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
  login: async ({ commit, dispatch, rootState }) => {
    console.log("Logging in...")
    console.log(rootState)

    provider = rootState.provider;
    network  = rootState.network;
    address  = rootState.address;

    if (provider) {
      try {
        const aOHMContract = await new ethers.Contract(addresses[network.chainId].AOHM_ADDRESS, ierc20Abi, provider);
        const aOHMBalanceBeforeDecimals = await aOHMContract.balanceOf( address );
        const aOHMBalance = aOHMBalanceBeforeDecimals / 1000000000;

        let ohmContract, ohmBalance=0, allowance=0;
        let sohmContract, sohmMainContract, sohmBalance=0, stakeAllowance=0, unstakeAllowance=0, circSupply=0;
        let stakingContract, profit=0;
        let lpStakingContract, totalLPStaked=0, lpStaked=0, pendingRewards=0, lpStakingAPY;
        let lpContract, lpBalance=0, lpStakeAllowance;
        let distributorContract, fiveDayRate = 0, stakingAPY=0, stakingRebase=0, stakingReward=0;
        let distributorContractSigner, currentIndex=0;
        let bondingCalcContract;
        let lpBondAllowance=0, daiBondAllowance=0;
        let pairContract;
        let migrateContract, aOHMAbleToClaim=0;

        if (whitelist.includes(address))
          commit('set', {whitelisted: true})

        const daiContract = new ethers.Contract(addresses[network.chainId].DAI_ADDRESS, ierc20Abi, provider);
        const balance = await daiContract.balanceOf(address);
        allowance = await daiContract.allowance(address, addresses[network.chainId].PRESALE_ADDRESS)!;


        if(addresses[network.chainId].BONDINGCALC_ADDRESS) {
          bondingCalcContract = new ethers.Contract(addresses[network.chainId].BONDINGCALC_ADDRESS, BondCalcContract, provider);
          lpContract = new ethers.Contract(addresses[network.chainId].LP_ADDRESS, ierc20Abi, provider);
        }

        if(addresses[network.chainId].BOND_ADDRESS) {
          lpBondAllowance  = await lpContract.allowance( address, addresses[network.chainId].BOND_ADDRESS );
          await dispatch('calcBondDetails', "");
          await dispatch('calculateUserBondDetails')
        }

        if (addresses[network.chainId].DAI_BOND_ADDRESS) {
          daiBondAllowance  = await daiContract.allowance( address, addresses[network.chainId].DAI_BOND_ADDRESS );
          await dispatch('calcDaiBondDetails', "");
          await dispatch('calculateUserDaiBondDetails');
        }

        if (addresses[network.chainId].MIGRATE_ADDRESS) {
          migrateContract = new ethers.Contract(addresses[network.chainId].MIGRATE_ADDRESS, MigrateToOHM, provider);
          aOHMAbleToClaim = await migrateContract.senderInfo( address );
        }

        if(addresses[network.chainId].LP_ADDRESS) {
          lpContract = new ethers.Contract(addresses[network.chainId].LP_ADDRESS, ierc20Abi, provider);
          lpBalance = await lpContract.balanceOf(address);
        }

        if(addresses[network.chainId].LPSTAKING_ADDRESS) {
          lpStakingContract = new ethers.Contract(addresses[network.chainId].LPSTAKING_ADDRESS, LPStaking, provider);
          lpContract = new ethers.Contract(addresses[network.chainId].LP_ADDRESS, ierc20Abi, provider);
          ohmContract = new ethers.Contract(addresses[network.chainId].OHM_ADDRESS, ierc20Abi, provider);

          totalLPStaked = await lpStakingContract.totalStaked();
          lpStaked = await lpStakingContract.getUserBalance( address );
          pendingRewards = await lpStakingContract.pendingRewards( address );
          lpStakeAllowance = await lpContract.allowance(address, addresses[network.chainId].LPSTAKING_ADDRESS);

          const totalLP = await lpContract.totalSupply();
          const OHMInLP = await ohmContract.balanceOf( addresses[network.chainId].LP_ADDRESS );

          const rewardPerBlock = await lpStakingContract.rewardPerBlock()
          lpStakingAPY = ( rewardPerBlock * 6650 * 366 * 100) / (totalLPStaked * OHMInLP / totalLP * 2 )
        }

        if(addresses[network.chainId].OHM_ADDRESS) {
          ohmContract = new ethers.Contract(addresses[network.chainId].OHM_ADDRESS, ierc20Abi, provider);
          ohmBalance = await ohmContract.balanceOf(address);
          stakeAllowance = await ohmContract.allowance(address, addresses[network.chainId].STAKING_ADDRESS)!;
        }
        if(addresses[network.chainId].SOHM_ADDRESS) {
          sohmContract = new ethers.Contract(addresses[network.chainId].SOHM_ADDRESS, ierc20Abi, provider);
          sohmMainContract = new ethers.Contract(addresses[network.chainId].SOHM_ADDRESS, sOHM, provider);

          sohmBalance = await sohmContract.balanceOf(address);
          unstakeAllowance = await sohmContract.allowance(address, addresses[network.chainId].STAKING_ADDRESS)!;
          circSupply = await sohmMainContract.circulatingSupply();
        }
        if(addresses[network.chainId].STAKING_ADDRESS) {
          stakingContract = new ethers.Contract(addresses[network.chainId].STAKING_ADDRESS, OlympusStaking, provider);
          profit = await stakingContract.ohmToDistributeNextEpoch();
        }

        if(addresses[network.chainId].DISTRIBUTOR_ADDRESS) {
          distributorContract = new ethers.Contract(addresses[network.chainId].DISTRIBUTOR_ADDRESS, DistributorContract, provider);
          sohmContract = new ethers.Contract(addresses[network.chainId].SOHM_ADDRESS, ierc20Abi, provider);
          stakingContract = new ethers.Contract(addresses[network.chainId].STAKING_ADDRESS, OlympusStaking, provider);

          circSupply = await sohmMainContract.circulatingSupply();

          stakingReward = await stakingContract.ohmToDistributeNextEpoch();

          stakingRebase = stakingReward / circSupply;
          fiveDayRate   = Math.pow(1 + stakingRebase, 5 * 3) - 1;
          stakingAPY    = Math.pow(1 + stakingRebase, 365 * 3);

          currentIndex = await sohmContract.balanceOf('0xA62Bee23497C920B94305FF68FA7b1Cd1e9FAdb2');
        }

        //const balance = balanceBefore.toFixed(2);
        console.log("Allowance", allowance);
        console.log("stakeAllowance", stakeAllowance);

        const [epochBlock, epochBlocksAway, epochSecondsAway] = await getNextEpoch();

        commit('set', {
          balance: ethers.utils.formatEther(balance),
          aOHMBalance: aOHMBalance,
          loading: false,
          ohmBalance: ethers.utils.formatUnits(ohmBalance, 'gwei'),
          sohmBalance: ethers.utils.formatUnits(sohmBalance, 'gwei'),
          totalLPStaked: ethers.utils.formatUnits(totalLPStaked, 'ether'),
          lpBalance: ethers.utils.formatUnits(lpBalance, 'ether'),
          lpStaked: ethers.utils.formatUnits(lpStaked, 'ether'),
          pendingRewards: ethers.utils.formatUnits(pendingRewards, 'gwei'),
          lpStakingAPY,
          stakingReward: ethers.utils.formatUnits(stakingReward, 'gwei'),
          fiveDayRate,
          stakingAPY,
          stakingRebase,
          currentIndex: ethers.utils.formatUnits(currentIndex, 'gwei'),
          aOHMAbleToClaim: ethers.utils.formatUnits(aOHMAbleToClaim, 'gwei'),
          epochBlock,
          epochBlocksAway,
          epochSecondsAway,
        });



        commit('set', {
          allowance,
          stakeAllowance,
          unstakeAllowance,
          lpStakeAllowance,
          lpBondAllowance,
          daiBondAllowance,
        });


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


  async getOHM({commit}, value) {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }


    const signer = provider.getSigner();
    const presale = await new ethers.Contract(addresses[network.chainId].PRESALE_ADDRESS, OHMPreSale, signer);
    const daiContract = new ethers.Contract(addresses[network.chainId].DAI_ADDRESS, ierc20Abi, signer);

    const presaleTX = await presale.purchaseaOHM(ethers.utils.parseEther(value).toString());
    await presaleTX.wait(console.log("Success"));
    const balance = await daiContract.balanceOf(address);
    commit('set', {
      // name,
      balance: ethers.utils.formatEther(balance)})
  },

  async getApproval({commit, dispatch}, value) {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }


    const signer = provider.getSigner();
    const daiContract = await new ethers.Contract(addresses[network.chainId].DAI_ADDRESS, ierc20Abi, signer);

    if(value <= 0) {
      alert("Please enter a value greater than 0");
      return;
    }

    const approveTx = await daiContract.approve(addresses[network.chainId].PRESALE_ADDRESS, ethers.utils.parseEther(value).toString());
    commit('set',{allowanceTx:1})
    await approveTx.wait();
    await dispatch('getAllowances')

  },

  async getAllowances({commit}) {
    if (address) {
      const diaContract = await new ethers.Contract(addresses[network.chainId].DAI_ADDRESS, ierc20Abi, provider);
      const allowance = await diaContract.allowance(address, addresses[network.chainId].PRESALE_ADDRESS);
      commit('set', {allowance});
    }
  },

  async getStakeApproval({commit, dispatch}, value) {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }

    const signer = provider.getSigner();
    const ohmContract = await new ethers.Contract(addresses[network.chainId].OHM_ADDRESS, ierc20Abi, signer);
    if (value <= 0) {
      alert("Please enter a value greater than 0");
      return;
    }

    // Approve tx
    let approveTx;
    try {
      approveTx = await ohmContract.approve(addresses[network.chainId].STAKING_ADDRESS, ethers.utils.parseUnits('1000000000', 'gwei').toString());
    } catch (error) {
      alert(error.message);
      return;
    }

    await approveTx.wait();
    await dispatch('getStakeAllowances')
  },

  async getLPStakeApproval({ commit, dispatch}, value) {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }


    const signer = provider.getSigner();
    const lpContract = await new ethers.Contract(addresses[network.chainId].LP_ADDRESS, ierc20Abi, signer);
    if(value <= 0) {
      alert("Please enter a value greater than 0");
      return;
    }

    const approveTx = await lpContract.approve(addresses[network.chainId].LPSTAKING_ADDRESS, ethers.utils.parseUnits('1000000000', 'ether').toString());
    await approveTx.wait();
    await dispatch('getLPStakeAllowance')
  },

  async getLPBondApproval({ commit, dispatch }, value ) {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }


    const signer = provider.getSigner();
    const lpContract = await new ethers.Contract(addresses[network.chainId].LP_ADDRESS, ierc20Abi, signer);
    if(value <= 0) {
      alert("Please enter a value greater than 0");
      return;
    }

    const approveTx = await lpContract.approve(addresses[network.chainId].BOND_ADDRESS, ethers.utils.parseUnits('1000000000', 'ether').toString());
    await approveTx.wait();
    await dispatch('getLPBondAllowance')
  },

  async getStakeAllowances({commit}) {
    if (address) {
      const ohmContract = await new ethers.Contract(addresses[network.chainId].OHM_ADDRESS, ierc20Abi, provider);
      const stakeAllowance = await ohmContract.allowance(address, addresses[network.chainId].STAKING_ADDRESS);
      commit('set', {stakeAllowance});
    }
  },

  async getLPStakeAllowance({commit}) {
    if(address) {
      const lpContract = await new ethers.Contract(addresses[network.chainId].LP_ADDRESS, ierc20Abi, provider);
      const lpStakeAllowance = await lpContract.allowance(address, addresses[network.chainId].LPSTAKING_ADDRESS);
      commit('set', {lpStakeAllowance});
    }
  },

  async getLPBondAllowance({commit}) {
    if(address) {
      const lpContract = await new ethers.Contract(addresses[network.chainId].LP_ADDRESS, ierc20Abi, provider);
      const lpBondAllowance = await lpContract.allowance(address, addresses[network.chainId].BOND_ADDRESS);
      commit('set', {lpBondAllowance});
    }
  },

  async getunStakeApproval({commit, dispatch}, value) {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }


    const signer = provider.getSigner();
    const sohmContract = await new ethers.Contract(addresses[network.chainId].SOHM_ADDRESS, ierc20Abi, signer);
    if(value <= 0) {
      alert("Please enter a value greater than 0");
      return;
    }

    const approveTx = await sohmContract.approve(addresses[network.chainId].STAKING_ADDRESS, ethers.utils.parseUnits('1000000000', 'gwei').toString());
    await approveTx.wait();
    await dispatch('getunStakeAllowances')
  },

  async getunStakeAllowances({commit}) {
    if(address) {
      const sohmContract = await new ethers.Contract(addresses[network.chainId].SOHM_ADDRESS, ierc20Abi, provider);
      const unstakeAllowance = await sohmContract.allowance(address, addresses[network.chainId].STAKING_ADDRESS);
      commit('set', {unstakeAllowance});
    }
  },
  async calculateSaleQuote({commit}, value) {
      const presale = await new ethers.Contract(addresses[network.chainId].PRESALE_ADDRESS, OHMPreSale, provider);
      const amount = await presale.calculateSaleQuote(ethers.utils.parseUnits(value, 'ether'));
      commit('set', {amount:ethers.utils.formatUnits(amount.toString(), 'gwei').toString()});
  },

  async getAllotmentPerBuyer({commit}) {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }

    const presale = await new ethers.Contract(addresses[network.chainId].PRESALE_ADDRESS, OHMPreSale, provider);
    const allotment = await presale.getAllotmentPerBuyer()
    commit('set', {allotment:ethers.utils.formatUnits(allotment, 'gwei')});
  },

  async getMaxPurchase({commit, dispatch}) {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }

    const presale = await new ethers.Contract(addresses[network.chainId].PRESALE_ADDRESS, OHMPreSale, provider);
    const salePrice = await presale.salePrice();
    const total = state.allotment * salePrice;

    commit('set', {maxPurchase:ethers.utils.formatUnits(total.toString(), 'ether')})
  },

  async stakeOHM({commit}, value) {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }

    const signer = provider.getSigner();
    const staking = await new ethers.Contract(addresses[network.chainId].STAKING_ADDRESS, OlympusStaking, signer);

    let stakeTx;
    try {
      stakeTx = await staking.stakeOHM(ethers.utils.parseUnits(value, 'gwei'));
    } catch (error) {
      if (error.code === -32603 && error.message.indexOf("ds-math-sub-underflow") >= 0) {
        alert("You may be trying to bond more than your balance! Error code: 32603. Message: ds-math-sub-underflow");
      } else {
        alert(error.message);
      }
      return;
    }

    await stakeTx.wait();
    const ohmContract = new ethers.Contract(addresses[network.chainId].OHM_ADDRESS, ierc20Abi, provider);
    const ohmBalance = await ohmContract.balanceOf(address);
    const sohmContract = new ethers.Contract(addresses[network.chainId].SOHM_ADDRESS, ierc20Abi, provider);
    const sohmBalance = await sohmContract.balanceOf(address);
    commit('set', {
      ohmBalance: ethers.utils.formatUnits(ohmBalance, 'gwei'),
      sohmBalance: ethers.utils.formatUnits(sohmBalance, 'gwei'),
    });
  },

  async unstakeOHM({commit}, value) {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }

    const signer = provider.getSigner();
    const staking = await new ethers.Contract(addresses[network.chainId].STAKING_ADDRESS, OlympusStaking, signer);
    const stakeTx = await staking.unstakeOHM(ethers.utils.parseUnits(value, 'gwei'));
    await stakeTx.wait();
    const ohmContract = new ethers.Contract(addresses[network.chainId].OHM_ADDRESS, ierc20Abi, provider);
    const ohmBalance = await ohmContract.balanceOf(address);
    const sohmContract = new ethers.Contract(addresses[network.chainId].SOHM_ADDRESS, ierc20Abi, provider);
    const sohmBalance = await sohmContract.balanceOf(address);
    commit('set', {
      ohmBalance: ethers.utils.formatUnits(ohmBalance, 'gwei'),
      sohmBalance: ethers.utils.formatUnits(sohmBalance, 'gwei'),
    });
  },

  async stakeLP({commit}, value) {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }

    const signer = provider.getSigner();
    const staking = await new ethers.Contract(addresses[network.chainId].LPSTAKING_ADDRESS, LPStaking, signer);

    // Deposit the bond
    let stakeTx;
    try {
      stakeTx = await staking.stakeLP(ethers.utils.parseUnits(value, 'ether'));
    } catch (error) {
      if (error.code === -32603 && error.message.indexOf("ds-math-sub-underflow") >= 0) {
        alert("You may be trying to bond more than your balance! Error code: 32603. Message: ds-math-sub-underflow");
      } else {
        alert(error.message);
      }
      return;
    }
    await stakeTx.wait();

    const lpContract = new ethers.Contract(addresses[network.chainId].LP_ADDRESS, ierc20Abi, provider);
    const lpBalance = await lpContract.balanceOf(address);
    const lpStakingContract = new ethers.Contract(addresses[network.chainId].LPSTAKING_ADDRESS, LPStaking, provider);
    const lpStaked = await lpStakingContract.getUserBalance(address);
    commit('set', {
      lpBalance: ethers.utils.formatUnits(lpBalance, 'ether'),
      lpStaked: ethers.utils.formatUnits(lpStaked, 'ether')
    });
  },

  async unstakeLP({commit}, value) {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }

    const signer = provider.getSigner();
    const staking = await new ethers.Contract(addresses[network.chainId].LPSTAKING_ADDRESS, LPStaking, signer);

    try {
      const unstakeTx = await staking.unstakeLP();
      await unstakeTx.wait();
    } catch (error) {
      alert(error.message);
      return;
    }

    const lpContract = new ethers.Contract(addresses[network.chainId].LP_ADDRESS, ierc20Abi, provider);
    const lpBalance = await lpContract.balanceOf(address);
    const lpStakingContract = new ethers.Contract(addresses[network.chainId].LPSTAKING_ADDRESS, LPStaking, provider);
    const lpStaked = await lpStakingContract.getUserBalance(address);
    commit('set', {
      lpBalance: ethers.utils.formatUnits(lpBalance, 'ether'),
      lpStaked: ethers.utils.formatUnits(lpStaked, 'ether')
    });
  },

  async claimRewards() {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }

    const signer = provider.getSigner();
    const staking = await new ethers.Contract(addresses[network.chainId].LPSTAKING_ADDRESS, LPStaking, signer);

    try {
      const claimTx = await staking.claimRewards();
      await claimTx.wait();
    } catch (error) {
      alert(error.message);
      return;
    }
  },

  async bondLP({commit}, value) {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }

    const signer = provider.getSigner();
    const  bonding = await new ethers.Contract(addresses[network.chainId].BOND_ADDRESS, BondContract, signer);

    // Deposit the bond
    let bondTx;
    try {
      bondTx = await bonding.depositBondPrinciple( ethers.utils.parseUnits( value, 'ether' ) );
    } catch (error) {
      if (error.code === -32603 && error.message.indexOf("ds-math-sub-underflow") >= 0) {
        alert("You may be trying to bond more than your balance! Error code: 32603. Message: ds-math-sub-underflow");
      } else {
        alert(error.message);
      }
      return;
    }

    // Wait for tx to be minted
    await bondTx.wait();
    const lpContract = new ethers.Contract(addresses[network.chainId].LP_ADDRESS, ierc20Abi, provider);
    const lpBalance = await lpContract.balanceOf(address);
    commit('set', {
      lpBalance: ethers.utils.formatUnits(lpBalance, 'ether')
    });
  },

  async redeemBond() {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }

    const signer = provider.getSigner();
    const bonding = await new ethers.Contract(addresses[network.chainId].BOND_ADDRESS, BondContract, signer);

    try {
      const redeemTx = await bonding.redeemBond();
      await redeemTx.wait();
    } catch (error) {
      alert(error.message);
    }

  },

  async forfeitBond() {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }

    const signer = provider.getSigner();
    const bonding = await new ethers.Contract(addresses[network.chainId].BOND_ADDRESS, BondContract, signer);
    const forfeitTx = await bonding.withdrawPrincipleAndForfeitInterest( );
    await forfeitTx.wait();
  },

  async getMaxSwap({commit, dispatch}) {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }

    const aOHMContract = await new ethers.Contract(addresses[network.chainId].AOHM_ADDRESS, ierc20Abi, provider);
    const aOHMBalanceBeforeDecimals = await aOHMContract.balanceOf( address );
    const aOHMBalance = aOHMBalanceBeforeDecimals / 1000000000;

    commit('set', { maxSwap: aOHMBalance });
},


  async migrateToOHM ({ commit }, value) {
    const signer = provider.getSigner();
    const migrateContact = await new ethers.Contract(addresses[network.chainId].MIGRATE_ADDRESS, MigrateToOHM, signer);

    const aOHMContract = await new ethers.Contract(addresses[network.chainId].AOHM_ADDRESS, ierc20Abi, provider);
    const aOHMContractWithSigner = aOHMContract.connect(signer);

    const allowance = await aOHMContract.allowance( address, addresses[network.chainId].MIGRATE_ADDRESS)

    if( allowance < value *  1000000000 ) {
      const approveTx = await aOHMContractWithSigner.approve(addresses[network.chainId].MIGRATE_ADDRESS, parseEther((1e9).toString()));
      commit('set',{allowanceTx:1})
      await approveTx.wait(state.confirmations);
    }

    const migrateTx = await migrateContact.migrate( value * 1000000000 );
    await migrateTx.wait();
  },

  async reclaimAOHM() {
    const signer = provider.getSigner();
    const migrateContact = await new ethers.Contract(addresses[network.chainId].MIGRATE_ADDRESS, MigrateToOHM, signer);

    const reclaimTx = await migrateContact.reclaim( );
    await reclaimTx.wait();
  },


  // Dai Bonds
  async getDaiBondApproval({ commit, dispatch }) {
    const signer    = provider.getSigner();
    const contract  = await new ethers.Contract(addresses[network.chainId].DAI_ADDRESS, ierc20Abi, signer);
    const approveTx = await contract.approve(addresses[network.chainId].DAI_BOND_ADDRESS, ethers.utils.parseUnits('1000000000', 'ether').toString());
    await approveTx.wait();
    await dispatch('getDaiBondAllowance')
  },

  async getDaiBondAllowance({commit}) {
    if (address) {
      const contract  = await new ethers.Contract(addresses[network.chainId].DAI_ADDRESS, ierc20Abi, provider);
      const daiBondAllowance = await contract.allowance(address, addresses[network.chainId].DAI_BOND_ADDRESS);
      commit('set', { daiBondAllowance });
    }
  },

  async redeemDaiBond() {
    const signer = provider.getSigner();
    const bonding = await new ethers.Contract(addresses[network.chainId].DAI_BOND_ADDRESS, DaiBondContract, signer);

    try {
      const redeemTx = await bonding.redeem();
      await redeemTx.wait();
    } catch (error) {
      alert(error.message);
    }
  },

  async bondDAI({commit}, value) {
    // NOTE: These should become dynamic
    const depositorAddress = address; // TODO: Change to BZBG
    const acceptedSlippage = 0.02; // 2%
    const valueInWei = ethers.utils.parseUnits( value.toString(), 'ether' );

    // Get the bonding contract
    const signer  = provider.getSigner();
    const daiBondContract = await new ethers.Contract(addresses[network.chainId].DAI_BOND_ADDRESS, DaiBondContract, signer);

    // Calculate maxPremium based on premium and slippage.
    const calculatePremium = await daiBondContract.calculatePremium();
    const maxPremium       = Math.round(calculatePremium * (1 + acceptedSlippage));

    console.log("value = ", value);
    console.log("calculatePremium = ", calculatePremium)
    console.log('valueInWei = ', valueInWei.toString());
    console.log("depositorAddress = ", depositorAddress)
    console.log("maxPremium = ", maxPremium.toString());

    // Deposit the bond
    let bondTx;
    try {
      bondTx = await daiBondContract.deposit( valueInWei, maxPremium, depositorAddress );
      await bondTx.wait();
    } catch (error) {
      if (error.code === -32603 && error.message.indexOf("ds-math-sub-underflow") >= 0) {
        alert("You may be trying to bond more than your balance! Error code: 32603. Message: ds-math-sub-underflow");
      } else {
        alert(error.message);
      }
      return;
    }

    // Update the balance
    const contract   = new ethers.Contract(addresses[network.chainId].DAI_ADDRESS, ierc20Abi, provider);
    const daiBalance = await contract.balanceOf(address);
    commit('set', {
      balance: ethers.utils.formatUnits(daiBalance, 'ether')
    });
  },

};


export default {
  state,
  mutations,
  actions
};
