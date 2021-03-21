<template>
  <div>
    <div id="dapp" class="dapp overflow-hidden">
      <!-- <VueLoadingIndicator v-if="settings.loading" class="overlay big" /> 
      <div v-else>
      </div>-->
      <div class="dapp-sidebar">

        <div class="dapp-menu-top">
          <div class="branding-header">
            <router-link :to="{ name: 'home' }" class="button button-dapp-menu">
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
      <div class="wrapper">
        <div class="dapp-center-modal">
          <div class="dapp-modal-wrapper">

            <div class="swap-input-column">
              
              <div class="stake-toggle-row">
                <toggle-switch
                  :options="myOptions"
                  @change="updateMap($event.value)"
                  @selected="selectedMethod()"
                  v-model="selectedMapOption"
                  :value="selectedMapOption"
                  :group="switchGroup"
                  /> 
              </div>

              <div class="swap-input-row">
                <div class="stake-input-container">
                  <input placeholder="Type an amount" class="bond-input" type="text">
                  <input placeholder="Type an amount" class="redeem-input" type="text">
                  
                  </div>
              </div>

              <div class="stake-amount-preset-row">
                <div class="stake-amount-preset-button">
                  25%
                </div>
                <div class="stake-amount-preset-button">
                  50%
                </div>
                <div class="stake-amount-preset-button">
                  75%
                </div>
                <div class="stake-amount-preset-button">
                  100%
                </div>
              </div>

             

              <div class="stake-price-data-column">
                <div class="stake-price-data-row">
                  <p class="price-label">Balance</p>
                  <p class="price-data">0.257 SLP</p>
                </div><div class="stake-price-data-row">
                  <p class="price-label">Value</p>
                  <p class="price-data">600 OLY</p>
                </div><div class="stake-price-data-row">
                  <p class="price-label">Bond Price</p>
                  <p class="price-data">15 OLY</p>
                </div><div class="stake-price-data-row">
                  <p class="price-label">Market Price</p>
                  <p class="price-data">16 OLY</p>
                </div>
              </div>

              <div class="redeem-button-container">
                <div class="redeem-button">Redeem</div>
                <div class="withdraw-button">Withdraw & Forfeit</div>
              </div>

            </div>
            
          </div>

          <div class="bond-data">
            <div class="bond-data-row">
              <div class="bond-data-column">
                <p>Debt Ratio</p>
                <p>xxxx</p>
              </div>
              <div class="bond-data-column">
                <p>Vesting Term</p>
                <p>xxxx</p>
              </div>
              <div class="bond-data-column">
                <p>Discount</p>
                <p>xxxx</p>
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
            {name: 'Bond', color: 'black', backgroundColor: 'white'}, 
            {name: 'Redeem', color: 'black', backgroundColor: 'white'}
          ]
        }
      },
      form: {
        quantity: ''
      },
      modalLoginOpen: false,
      modalMakepotionOpen: false
    };
  }, 
  computed: {
    ...mapState(['settings']),
    isValid() {
      return parseFloat(this.form.quantity);
    },
    maxStrike() {
      const exchangeRate = this.settings.exchangeRates[this.form.asset];
      return exchangeRate && exchangeRate.usd ? exchangeRate.usd : 1e9;
    }
  },

  methods: {
    
    ...mapActions(['SendDai']),
    handleSubmit() {
      this.SendDai({
        //address: '0xb72027693a5B717B9e28Ea5E12eC59b67c944Df7',
        value: this.form.quantity
      });
    },
    maxStake() {
      this.form.quantity = this.$store.state.settings.balance;
    },
    disconnect() {
      if(this.$store.state.settings.address)
      return this.$store.state.address.initial
      return null
    }
  }
};

</script>
<style scoped>
.hasEffect {
  cursor: pointer;
}
</style>