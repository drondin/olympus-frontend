<template>
  <div class="d-flex align-items-center justify-content-center h-100">
    <div class="dapp-center-modal py-2 px-4 py-md-4 px-md-2">
    <div class="dapp-modal-wrapper">

      <div class="swap-input-column">

        <div class="stake-toggle-row">
          <toggle-switch
            :options="myOptions"
            v-model="selectedMapOption"
            :value="selectedMapOption"
            />
        </div>

        <div v-if="isUnstake==false" class="swap-input-row">
          <div class="stake-input-container">
            <input v-model='quantity' placeholder="Type an amount" class="stake-input" type="number">
          </div>

          <div v-if="isUnstake==true">
          </div>

        </div>


        <div v-if="isUnstake==false" class="stake-amount-preset-row">
          <div class="stake-amount-preset-button hasEffect" @click='setStake(25)'>
            25%
          </div>
          <div class="stake-amount-preset-button hasEffect" @click='setStake(50)'>
            50%
          </div>
          <div class="stake-amount-preset-button hasEffect" @click='setStake(75)'>
            75%
          </div>
          <div class="stake-amount-preset-button hasEffect" @click='setStake(100)'>
            100%
          </div>
        </div>



        <div class="stake-price-data-column">
          <div class="stake-price-data-row">
            <p class="price-label">Balance</p>
            <p class="price-data">{{ trim( $store.state.settings.lpBalance, 4 ) }} OHM / DAI SLP</p>
          </div><div class="stake-price-data-row">
            <p class="price-label">Staked</p>
            <p class="price-data">{{ trim( $store.state.settings.lpStaked, 4 ) }} OHM / DAI SLP</p>
          </div><div class="stake-price-data-row">
            <p class="price-label">Pending Rewards</p>
            <p class="price-data">{{ trim( $store.state.settings.pendingRewards, 4 ) }} OHM</p>
          </div><div class="stake-price-data-row">
            <p class="price-label">APY</p>
            <p class="price-data">{{trim( $store.state.settings.lpStakingAPY, 4 ) }}%</p> <!-- 1+rebase^1095-1 -->
          </div><div class="stake-price-data-row">
            <p class="price-label">Total Staked</p>
            <p class="price-data">{{ trim( $store.state.settings.totalLPStaked, 4 ) }} OHM / DAI SLP</p>
          </div>
        </div>

        <div  v-if='hasAllowance'  class="d-flex align-self-center mb-4">
          <div class="stake-button" @click='executeStake'>{{selectedMapOption}}</div>
        </div>
        <div  v-else-if='isUnstake==true'  class="d-flex align-self-center mb-4">
          <div class="stake-button" @click='executeStake'>{{selectedMapOption}} / Claim</div>

          <div class="stake-button" @click='claimLPRewards'>Claim Rewards</div>
        </div>
        <div v-else class="d-flex align-self-center mb-4">
          <div class="stake-button" @click='seekApproval'>Approve</div>
        </div>

      </div>

    </div>
  </div>
  </div>

</template>

<script>
import { mapState, mapActions } from 'vuex';
import { ethers } from 'ethers';

export default {
  data() {
    return {
      myOptions: {
        layout: {
          color: 'white',
          backgroundColor: '#282828',
          selectedColor: 'white',
          selectedBackgroundColor: 'green',
          borderColor: 'white',
          fontFamily: 'Arial',
          fontWeight: 'normal',
          lineHeight: '1',
          fontWeightSelected: 'bold',
          squareCorners: false,
          noBorder: false
        },
        size: {
          fontSize: 1,
          height: 2.5,
          padding: 0.3,
          width: 15,
          borderRadius: 5,
        },
        items: {
          delay: .4,
          preSelected: 'unknown',
          disabled: false,
          labels: [
            {name: 'Stake', color: 'black', backgroundColor: 'white'},
            {name: 'Unstake', color: 'black', backgroundColor: 'white'}
          ]
        }
      },
      selectedMapOption: 'Stake',
      quantity: '',
      stakeToggle: true,
    };
  },
  computed: {
    ...mapState(['settings']),
    isValid() {
      return parseFloat(this.form.quantity);
    },
    hasAllowance() {
      if(parseFloat(this.quantity)) {
        switch(this.selectedMapOption) {
          case 'Stake':
              return parseInt(this.$store.state.settings.lpStakeAllowance) >= parseInt(ethers.utils.parseUnits(this.quantity.toString(), 'ether'));
          case 'Unstake':
              return true;
        }

      }
      return false;
    },

    isUnstake() {

        if(this.selectedMapOption) {
            switch(this.selectedMapOption) {
                case 'Unstake':
                    return true;
            }
        }
    return false;
    }

  },

  methods: {

    ...mapActions(['getLPStakeApproval', 'stakeLP', 'unstakeLP', 'claimRewards']),
    async executeStake() {console.log(this.selectedMapOption)
        switch(this.selectedMapOption) {
          case 'Stake':
            if( isNaN( this.quantity ) ) {
              return;
            }

            else {
              await this.stakeLP(this.quantity.toString());
            }

            break;
          case 'Unstake':
            await this.unstakeLP();
        }
        //updatestats
    },

    async claimLPRewards() {
        await this.claimRewards();
    },

    setStake(value) {
        switch(this.selectedMapOption) {
          case 'Stake':
            this.quantity = this.$store.state.settings.lpBalance * value / 100;
            break;
        }

    },
    async seekApproval() {
        switch(this.selectedMapOption) {
          case 'Stake':

            if( isNaN( this.quantity ) ) {
              return;
            }
            else {
              await this.getLPStakeApproval(this.quantity.toString());
            }

            break;
        }

    },

    trim(number, precision){
        if( number == undefined ) {
          number = 0
        }
        const array = number.toString().split(".");
        array.push(array.pop().substring(0, precision));
        const trimmedNumber =  array.join(".");
        return(trimmedNumber);
    },
    maxStake() {
      this.form.quantity = this.$store.state.settings.lpBalance;
    },
  }
};

</script>
<style scoped>
  .hasEffect {
    cursor: pointer;
  }
</style>
