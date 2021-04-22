<template>
  <div class="d-flex align-items-center justify-content-center min-vh-100">
    <div class="dapp-center-modal flex-column">
      <div class="d-flex flex-row align-items-center my-2 px-2 my-md-4 px-md-4">
        <router-link :to="{ name: 'choose_bond'}" class="align-items-center" style="position:absolute">
          <i class="fa fa-chevron-left"></i>
          Back
        </router-link>

        <div class="d-flex flex-row col justify-content-center">
          <div class="ohm-pairs d-flex mr-2 d-none d-sm-flex">
            <div class="ohm-pair" style="z-index: 1;">
              <img src="https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png">
            </div>
          </div>

          <div class="text-light align-self-center">
            <h3>
              DAI Bond
            </h3>
          </div>
        </div>
      </div>

      <div class="dapp-modal-wrapper py-2 px-2 py-md-4 px-md-2 m-auto">

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
                v-model='quantity'
                id="dai-bond-input-id"
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
              <p class="price-data">{{ trimNumber( $store.state.settings.balance, 2 ) }} DAI</p>
            </div><div class="stake-price-data-row">
              <p class="price-label">Bond Price</p>
              <p id="bond-price-id" class="price-data">{{ trimNumber( $store.state.settings.daiBond.price, 2 ) }} DAI</p>
            </div><div class="stake-price-data-row">
              <p class="price-label">Market Price</p>
              <p id="bond-market-price-id" class="price-data">{{ trimNumber( $store.state.settings.marketPrice, 2 ) }} DAI</p>
            </div>

            <div class="stake-price-data-row" :style="{visibility: hasEnteredAmount ? 'visible' : 'hidden'}">
              <p class="price-label">You Will Get</p>
              <p id="bond-value-id" class="price-data">{{ trimNumber( $store.state.settings.daiBond.value / Math.pow(10, 18), 4 ) }} OHM</p>
            </div>
          </div>

          <div v-else class="stake-price-data-column">
            <div class="stake-price-data-row">
              <p class="price-label">Balance</p>
              <p class="price-data">{{ trimNumber( $store.state.settings.balance, 2 ) }} DAI</p>
            </div>
          <div class="stake-price-data-row">
              <p class="price-label">Pending Rewards</p>
              <p id="bond-market-price-id" class="price-data">{{ trimNumber( $store.state.settings.daiBond.interestDue, 2 ) }} OHM</p>
            </div>
            <div class="stake-price-data-row">
              <p class="price-label">Claimable Rewards</p>
              <p id="bond-market-price-id" class="price-data">{{ trimNumber( $store.state.settings.daiBond.pendingPayout, 2 ) }} OHM</p>
            </div>
            <div class="stake-price-data-row">
              <p class="price-label">Full Bond Maturation</p>
              <p id="bond-market-price-id" class="price-data">Block {{ $store.state.settings.daiBond.bondMaturationBlock }}</p>
            </div>
          </div>

          <div v-if="isRedeem==true" class="d-flex align-self-center mb-4">
            <div class="redeem-button" @click='redeem' >Claim Rewards</div>
          </div>

          <div v-else-if="hasAllowance==true && isRedeem==false" class="d-flex align-self-center mb-4">
            <div id="bond-button-id" class="redeem-button" @click='bond' >Bond DAI</div>
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
            <p>{{ trimNumber( $store.state.settings.daiBond.debtRatio / 10000000, 2 ) }}%</p>
          </div>
          <div class="col-4 text-center">
            <p>Vesting Term</p>
            <p>{{ $store.state.settings.daiBond.vestingPeriodInBlocks }}</p>
          </div>
          <div class="col-4 text-center">
            <p>Discount</p>
            <p>{{ trim( $store.state.settings.daiBond.discount * 100, 2 ) }}%</p>
          </div>
        </div>
      </div>



    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import mixin from '@/helpers/mixins';
  import { roundBalance } from '@/helpers/utils';

  export default {
    mixins: [mixin],

    async mounted() {
      await this.calcDaiBondDetails('');
      await this.calculateUserDaiBondDetails();
    },

    data() {
      return {
        quantity: null,

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

      hasEnteredAmount() {
        return !!this.quantity && this.quantity !== '';
      },

      isRedeem() {
        return this.selectedMapOption === 'Redeem'
      },

      hasAllowance() {
        return this.$store.state.settings.daiBondAllowance > 0;
      }
    },


    methods: {
      ...mapActions(['redeemDaiBond', 'bondDAI', 'getDaiBondApproval', 'calcDaiBondDetails', 'calculateUserDaiBondDetails']),

      async setStake(value) {
        // Calculate suppliedQuantity and round it to down to avoid conflicts with uint.
        const suppliedQuantity = roundBalance(this.$store.state.settings.balance * value / 100)

        if (this.selectedMapOption === 'Bond') {
          this.quantity = suppliedQuantity;
          await this.calcDaiBondDetails( suppliedQuantity );
          await this.calculateUserDaiBondDetails();
        }
      },

      async onInputChange() {
        await this.calcDaiBondDetails( this.quantity );
        await this.calculateUserDaiBondDetails();
      },

      async seekApproval() {
        if ( isNaN( this.quantity) || this.quantity === '' ) {
          alert("Please enter a value!");
          return;
        } else {
          await this.getDaiBondApproval();
        }
      },

      async bond() {
        const bondInterest  = this.$store.state.settings.daiBond.interestDue;
        const bondRewardDue = this.$store.state.settings.daiBond.pendingPayout;

        if (!this.quantity || this.quantity === '' || isNaN(this.quantity)) {
          alert("Please enter a value!");
          return;
        } else if ( bondInterest > 0 || bondRewardDue > 0 ) {
          const shouldProceed = confirm('You have an existing DAI bond. Bonding will reset your vesting period and forfeit rewards. We recommend claiming rewards first or using a fresh wallet. Do you still want to proceed?')
          if (shouldProceed) {
            await this.bondDAI(this.quantity);
          }
        } else {
          await this.bondDAI(this.quantity);
        }
      },

      async redeem() {
        await this.redeemDaiBond();
      },
    }
  };

</script>
<style scoped>
  .hasEffect {
    cursor: pointer;
  }
</style>
