<template>
  <div class="d-flex align-items-center justify-content-center min-vh-100">
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

        <div class="swap-input-row">
          <div class="stake-input-container">
            <input v-model='quantity' placeholder="Type an amount" class="stake-input" type="number">

            </div>
        </div>
        <div class="stake-amount-preset-row">
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
            <p class="price-data">{{ trim( $store.state.settings.ohmBalance, 4 ) }} OHM</p>
          </div>
          <div class="stake-price-data-row">
            <p class="price-label">Staked</p>
            <p class="price-data">{{ trim( $store.state.settings.sohmBalance, 4 ) }} OHM</p>
          </div>


          <div class="stake-price-data-row">
            <p class="price-label">Time until rebase</p>
            <p class="price-data">
              {{
                $store.state.settings.epochBlock ? `${($store.state.settings.epochSecondsAway / 60 / 60).toFixed(1)} hours` : ''
              }}
            </p>
          </div>


          <div class="stake-price-data-row">
            <p class="price-label">Upcoming rebase</p>
            <p class="price-data">{{ trim( $store.state.settings.stakingRebase * 100, 4 ) }}% </p>
          </div>
          <div class="stake-price-data-row">
            <p class="price-label">5-day rate</p>
            <p class="price-data">{{ trim( $store.state.settings.fiveDayRate * 100, 4 ) }}% </p>
          </div>
          <div class="stake-price-data-row">
            <p class="price-label">Current APY</p>
            <p class="price-data">{{ trim( $store.state.settings.stakingAPY * 100, 2 )}}%</p>
          </div>
          <div class="stake-price-data-row">
            <p class="price-label">Current index</p>
            <p class="price-data">{{ trim( $store.state.settings.currentIndex, 4)}} OHM</p>
          </div>
        </div>

        <div  v-if='hasAllowance'  class="d-flex align-self-center mb-2">
          <div class="stake-button" @click='executeStake'>{{selectedMapOption}}</div>
        </div>
        <div v-else class="d-flex align-self-center mb-2">
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

      return parseInt(this.$store.state.settings.stakeAllowance) > 0;

      // if(parseFloat(this.quantity)) {
      //   switch(this.selectedMapOption) {
      //     case 'Stake':
      //         return parseInt(this.$store.state.settings.stakeAllowance) >= parseInt(ethers.utils.parseUnits(this.quantity.toString(), 'gwei'));
      //     case 'Unstake':
      //         return parseInt(this.$store.state.settings.unstakeAllowance) >= parseInt(ethers.utils.parseUnits(this.quantity.toString(), 'gwei'));
      //   }
      // }
      // return false;
    },
  },

  methods: {

    ...mapActions(['SendDai', 'getStakeApproval', 'stakeOHM', 'unstakeOHM', 'getunStakeApproval', 'getStakingAPY', 'getCurrentBlockNumber']),
    async executeStake() {

      switch(this.selectedMapOption) {
        case 'Stake':
          if( isNaN( this.quantity ) || this.quantity === 0 || this.quantity === '' ) {
            alert("Please enter a value!");
            return;
          } else {
            await this.getCurrentBlockNumber();
            await this.stakeOHM(this.quantity.toString());
          }

          break;
        case 'Unstake':
          if( isNaN( this.quantity ) || parseInt(this.quantity) === 0 || this.quantity === '' ) {
            alert("Please enter a value!");
            return;
          }

          else {
            await this.unstakeOHM(this.quantity.toString());
          }

      }
      //updatestats
    },
    setStake(value) {
        switch(this.selectedMapOption) {
          case 'Stake':
            this.quantity = this.$store.state.settings.ohmBalance * value / 100;
            break;
          case 'Unstake':
            this.quantity = this.$store.state.settings.sohmBalance * value / 100;
        }

    },

    trim(number, precision){
        if( number == undefined ) {
          number = 0;
        }
        const array = number.toString().split(".");
        array.push(array.pop().substring(0, precision));
        const trimmedNumber =  array.join(".");
        return(trimmedNumber);
    },

    async seekApproval() {
        switch(this.selectedMapOption) {
          case 'Stake':
            if( isNaN( this.quantity )) {
              return;
            }

            else {
              await this.getStakeApproval(this.quantity.toString());
            }
            break;
          case 'Unstake':
            if( isNaN( this.quantity )) {
              return;
            }
            else {
              await this.getunStakeApproval(this.quantity.toString());
            }

        }

    },
    maxStake() {
      this.form.quantity = this.$store.state.settings.balance;
    },
  }
};

</script>
<style scoped>
.hasEffect {
  cursor: pointer;
}
</style>
