<template>
  <div class="d-flex align-items-center justify-content-center min-vh-100">
    <div class="dapp-center-modal">
      <div class="dapp-modal-wrapper py-2 px-4 py-md-4 px-md-2">

        <div class="swap-input-column">

          <div class="stake-toggle-row">
            <toggle-switch
              :options="myOptions"
              v-model="selectedMapOption"
              :value="selectedMapOption"
              />
          </div>

          <div v-if="isRedeem==false" class="swap-input-row">

            <div class="stake-input-container">
              <input
                v-on:keyup="onInputChange"
                v-on:change="onInputChange"
                id="bond-input-id"
                placeholder="Type an amount"
                class="bond-input"
                type="number"
              />
            </div>

            <div v-if="isRedeem==true">
            </div>

          </div>

          <div v-if="isRedeem==false" class="stake-amount-preset-row">
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



          <div v-if="isRedeem==false" class="stake-price-data-column">
            <div class="stake-price-data-row">
              <p class="price-label">Balance</p>
              <p class="price-data">{{ trim( $store.state.settings.lpBalance, 4 ) }} SLP</p>
            </div><div class="stake-price-data-row">
              <p class="price-label">Bond Price</p>
              <p id="bond-price-id" class="price-data">{{ trim( $store.state.settings.bondPrice / 1000000000, 4 ) }} DAI</p>
            </div><div class="stake-price-data-row">
              <p class="price-label">Market Price</p>
              <p id="bond-market-price-id" class="price-data">{{ trim( $store.state.settings.marketPrice, 4 ) }} DAI</p>
            </div>

            <div class="stake-price-data-row" :style="{visibility: hasEnteredAmount ? 'visible' : 'hidden'}">
              <p class="price-label">You Will Get</p>
              <p id="bond-value-id" class="price-data">{{ trim( $store.state.settings.bondValue / 1000000000, 4 ) }} OHM</p>
            </div>
          </div>

          <div v-else class="stake-price-data-column">
            <div class="stake-price-data-row">
              <p class="price-label">Balance</p>
              <p class="price-data">{{ trim( $store.state.settings.lpBalance, 4 ) }} SLP</p>
            </div>
          <div class="stake-price-data-row">
              <p class="price-label">Pending Rewards</p>
              <p id="bond-market-price-id" class="price-data">{{ trim( $store.state.settings.interestDue, 4 ) }} OHM</p>
            </div>
            <div class="stake-price-data-row">
              <p class="price-label">Claimable Rewards</p>
              <p id="bond-market-price-id" class="price-data">{{ trim( $store.state.settings.pendingPayout, 4 ) }} OHM</p>
            </div>
            <div class="stake-price-data-row">
              <p class="price-label">Full Bond Maturation</p>
              <p id="bond-market-price-id" class="price-data">Block {{ $store.state.settings.bondMaturationBlock }}</p>
            </div>
          </div>

          <div v-if="isRedeem==true" class="d-flex align-self-center mb-4">
            <div class="redeem-button" @click='redeem' >Claim Rewards</div>
          </div>

          <div v-else-if="hasAllowance==true && isRedeem==false" class="d-flex align-self-center mb-4">
            <div id="bond-button-id" class="redeem-button" @click='bond' >Bond</div>
          </div>

          <div v-else class="d-flex align-self-center mb-4" >
            <div id="bond-button-id" class="redeem-button" @click='seekApproval' >Approve</div>
          </div>

        </div>

      </div>

      <div class="bond-data">
        <div class="row bond-data-row p-4">
          <div class="col-4 text-center">
            <p>Debt Ratio</p>
            <p>{{ trim( $store.state.settings.debtRatio / 10000000, 2 ) }}%</p>
          </div>
          <div class="col-4 text-center">
            <p>Vesting Term</p>
            <p>{{ $store.state.settings.vestingPeriodInBlocks }}</p>
          </div>
          <div class="col-4 text-center">
            <p>Discount</p>
            <p>{{ trim( $store.state.settings.bondDiscount * 100, 2 ) }}%</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { ethers } from 'ethers';
import mixin from '@/helpers/mixins';
import { roundBalance } from '@/helpers/utils';

export default {
  mixins: [mixin],

  async mounted() {
    const amount = document.getElementById('bond-input-id').value;
    await this.calcBondDetails( amount );
  },

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
            {name: 'Bond', color: 'black', backgroundColor: 'white'},
            {name: 'Redeem', color: 'black', backgroundColor: 'white'}
          ]
        }
      },
      selectedMapOption: 'Bond',
      bondToggle: true,
    };
  },
  computed: {
    ...mapState(['settings']),

    maxStrike() {
      const exchangeRate = this.settings.exchangeRates[this.form.asset];
      return exchangeRate && exchangeRate.usd ? exchangeRate.usd : 1e9;
    },

    hasEnteredAmount() {
      return this.$store.state.settings.amount;
    },

    isRedeem() {
      if(this.selectedMapOption) {
        switch(this.selectedMapOption) {
            case 'Redeem':
              return true;
        }
      }

      return false;
    },

    hasAllowance() {
      const approval = this.$store.state.settings.lpBondAllowance;

      if(approval > 0 ) {
       return true;
      }

      return false;

    }

  },


  methods: {

    ...mapActions(['redeemBond', 'bondLP', 'getLPBondApproval', 'getLPBondAllowance', 'calcBondDetails']),

    async setStake(value) {
      // Calculate suppliedQuantity and round it to down to avoid conflicts with uint.
      let suppliedQuantity = roundBalance(this.$store.state.settings.lpBalance * value / 100)

      if (this.selectedMapOption === 'Bond') {
        this.quantity = suppliedQuantity;
        document.getElementById('bond-input-id').value = suppliedQuantity;
        await this.calcBondDetails( suppliedQuantity );
      }
    },

    async onInputChange() {
      const amount = document.getElementById('bond-input-id').value;
      await this.calcBondDetails( amount );
    },

    async seekApproval() {
      switch(this.selectedMapOption) {
        case 'Bond':
        if( isNaN( this.$store.state.settings.amount ) ) {
          alert("The value entered is not a number. Please try again!");
          return;
        } else {
          await this.getLPBondApproval(this.$store.state.settings.amount);
        }

        break;
      }

    },

    async bond() {
      const value = this.$store.state.settings.amount;
      const bondInterest  = this.$store.state.settings.interestDue;
      const bondRewardDue = this.$store.state.settings.pendingPayout;

      switch(this.selectedMapOption) {
        case 'Bond':
          if (value === '') {
            alert("Please enter a value!");
          } else if( isNaN(value) ) {
            alert("Please enter a valid value!");
          } else if ( bondInterest > 0 || bondRewardDue > 0 ) {
            const shouldProceed = confirm('You have an existing bond. Bonding will reset your vesting period and forfeit rewards. We recommend claiming rewards first or using a fresh wallet. Do you still want to proceed?')
            if (shouldProceed) {
              await this.bondLP(value);
            }
          } else {
            await this.bondLP(value);
          }

          break;

      }
    },

    async redeem() {
      await this.redeemBond();
    },
  }
};

</script>
<style scoped>
.hasEffect {
  cursor: pointer;
}
</style>
