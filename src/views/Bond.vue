<template>
  <div>
    <div id="dapp" class="dapp overflow-hidden">
      <!-- <VueLoadingIndicator v-if="settings.loading" class="overlay big" /> 
      <div v-else>
      </div>-->
      <div class="dapp-sidebar">

        <div class="dapp-menu-top">
          <div class="branding-header">
            <router-link :to="{ name: 'home' }" class="">
            <img class="branding-header-icon" src="~/@/assets/logo.svg" alt="">
          </router-link>
          </div>
          <div class="wallet-menu">
            <a v-if="address" class="disconnect-button button-primary button" @click="$store.state.settings.address = ''">Disconnect</a>
          <a v-if="address" class="dapp-sidebar-button-connected button button-info">
            <span class="login-bullet mr-2 ml-n2" />
            {{ shorten(address) }}
          </a>
          <a v-else class="dapp-sidebar-button-connect button button-primary" @click="modalLoginOpen = true">
            Connect wallet
          </a>
          </div>
        </div>

        <div class="dapp-menu-links">
          <Dav />

        </div>

        <div class="dapp-menu-social">
                    <Social />
        </div>
      </div>

       <!-- <div class="wrapper">
        <div class="dapp-center-modal">
          <h1 style="line-height:25rem;">COMING SOON!</h1>
        </div>
      </div>  -->

       <div class="wrapper">
        <div class="dapp-center-modal">
          <div class="dapp-modal-wrapper">

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
                    v-on:keydown="onInputChange"
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

                <div class="stake-price-data-row">
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

              <div v-if="isRedeem==true" class="redeem-button-container">
                <div class="redeem-button" @click='redeem' >Claim Rewards</div>
              </div>

              <div v-else-if="hasAllowance==true && isRedeem==false" class="redeem-button-container">
                <div id="bond-button-id" class="redeem-button" @click='bond' >Bond</div>
              </div>

              <div v-else class="redeem-button-container" >              
                <div id="bond-button-id" class="redeem-button" @click='seekApproval' >Approve</div>
              </div>

            </div>
            
          </div>

          <div class="bond-data">
            <div class="bond-data-row">
              <div class="bond-data-column">
                <p>Debt Ratio</p>
                <p>{{ trim( $store.state.settings.debtRatio / 10000000, 2 ) }}%</p>
              </div>
              <div class="bond-data-column">
                <p>Vesting Term</p>
                <p>{{ $store.state.settings.vestingPeriodInBlocks }}</p>
              </div>
              <div class="bond-data-column">
                <p>Discount</p>
                <p>{{ trim( $store.state.settings.bondDiscount * 100, 2 ) }}%</p>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
    <ModalLogin :open="modalLoginOpen" @close="modalLoginOpen = false" />

  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { shorten } from '@/helpers/utils.ts';
import { ethers } from 'ethers';

export default {
  async mounted() {
    let amount = document.getElementById('bond-input-id').value;
    amount = amount * 1000000000000000000;
    await this.calcBondDetails( amount.toString() );
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
      quantity: '',
      bondToggle: true,
      modalLoginOpen: false,
    };
  }, 
  computed: {
    ...mapState(['settings']),
    isValid() {
      return parseFloat(this.form.quantity);
    },

    address() {
      if(this.$store.state.settings.address)
      return this.$store.state.settings.address
      return null
    }, 

    maxStrike() {
      const exchangeRate = this.settings.exchangeRates[this.form.asset];
      return exchangeRate && exchangeRate.usd ? exchangeRate.usd : 1e9;
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
    
    ...mapActions(['redeemBond', 'bondLP', 'forfeitBond', 'getLPBondApproval', 'getLPBondAllowance', 'calcBondDetails']),
    maxStake() {
      this.form.quantity = this.$store.state.settings.balance;
    },
    disconnect() {
      if(this.$store.state.settings.address)
      return this.$store.state.address.initial
      return null
    },
    shorten(addr) { 
      return shorten(addr);
    },

    async setStake(value) {
      // Calculate suppliedQuantity and round it to avoid conflicts with uint.
      let suppliedQuantity = this.$store.state.settings.lpBalance * value / 100;
      suppliedQuantity = Math.round( suppliedQuantity * 1000000000000000000)/1000000000000000000;

      switch(this.selectedMapOption) {
        case 'Bond':
          this.quantity = suppliedQuantity;
          document.getElementById('bond-input-id').value = suppliedQuantity;
          break;
      }

      const amount = suppliedQuantity * 1000000000000000000;
      await this.calcBondDetails( amount.toString() );
    },

    async onInputChange() {
      let amount = document.getElementById('bond-input-id').value;
      amount = amount * 1000000000000000000;
      await this.calcBondDetails( amount.toString() );
    },

    async seekApproval() {
        switch(this.selectedMapOption) {
          case 'Bond':

            if( isNaN( this.quantity ) ) {
              return;
            }
            else {
              await this.getLPBondApproval(document.getElementById('bond-input-id').value);
            }

            break;
        }

    },

    async bond() {
      const value = document.getElementById('bond-input-id').value;
      const bondInterest  = this.$store.state.settings.interestDue;
      const bondRewardDue = this.$store.state.settings.pendingPayout;

      switch(this.selectedMapOption) {
        case 'Bond':
          if (value === '') {
            alert("Please enter a value!");
          } else if( isNaN(value) ) {
            alert("Please enter a valid value!");
          } else if ( bondInterest || bondRewardDue ) {
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

    async forfeit() {
      await this.forfeitBond();
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

  }
};

</script>
<style scoped>
.hasEffect {
  cursor: pointer;
}
</style>