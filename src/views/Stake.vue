<template>
  <div>
    <div id="dapp" class="dapp overflow-hidden">
      <!-- <VueLoadingIndicator v-if="settings.loading" class="overlay big" /> 
      <div v-else>
      </div>-->
      <div class="dapp-sidebar">

        <div class="dapp-menu-top">
          <div class="branding-header">
            <img class="branding-header-icon" src="~/@/assets/logo.svg" alt="">
          </div>
          <div class="wallet-menu">
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
                  <input placeholder="Type an amount" class="stake-input" type="text">
                  
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
                  <p class="price-data">{{$store.state.settings.ohmBalance}} OHM</p>
                </div><div class="stake-price-data-row">
                  <p class="price-label">Staked</p>
                  <p class="price-data">{{$store.state.settings.sohmBalance}} OHM</p>
                </div><div class="stake-price-data-row">
                  <p class="price-label">Upcoming rebase</p>
                  <p class="price-data">2%</p>
                </div><div class="stake-price-data-row">
                  <p class="price-label">Upcoming APY</p>
                  <p class="price-data">261,329,284,342%</p>
                </div><div class="stake-price-data-row">
                  <p class="price-label">Current index</p>
                  <p class="price-data">10 OHM</p>
                </div>
              </div>

              <div class="stake-button-container">
                <div class="stake-button" @click='executeStake'>Stake</div>
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
      quantity: '',
      stakeToggle: true,
      modalLoginOpen: false,
    };
  }, 
  created() {
      this.selectedMapOption = 'Stake'
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
  },

  methods: {
    
    ...mapActions(['SendDai']),
    async executeStake() {
        switch(this.selectedMapOption) {
          case 'Staked':
            await this.stakeOHM();
            break;
          case 'Unstake':
            await this.unstakeOHM();
        }
        //updatestats        
    },
    shorten(addr) { 
      return shorten(addr);
    },    
    maxStake() {
      this.form.quantity = this.$store.state.settings.balance;
    }
  }
};

</script>
<style scoped>
.hasEffect {
  cursor: pointer;
}
</style>