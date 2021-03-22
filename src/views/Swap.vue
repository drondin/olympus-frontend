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
      <div class="wrapper">
        <div class="dapp-center-modal">
          <div class="dapp-modal-wrapper">

            <div class="swap-input-column">

              <!-- <div class="balance-row"><p>Balance</p><p class="balance-data">{{ $store.state.settings.aOHMBalance }}</p><p>AlphaOHM</p> </div> -->
              <div class="balance-row"><p>Balance</p><p class="balance-data">{{$store.state.settings.aOHMBalance}}</p><p>AlphaOHM</p> </div>

              <div class="swap-input-row">
                <div class="swap-input-container">
                  <input v-on:change='updateValuesOnInChange' placeholder="0.0" id="swap-input-id" class="swap-input" type="text">
                  
                  </div>

                  <div class="cur-max-box">
                    <img src="~/@/assets/alpha.svg" alt="">
                    <div class="max-button" @click='maxSwap'>
                      100%
                    </div>
                    </div>
              </div>

              <div class="swap-arrow">
                <img src="~/@/assets/Arrow.svg" alt="" class="social-icon-small">
              </div>

              <div class="swap-ourput-row">
                  <div class="swap-output-container">
                  <input v-on:change='updateValuesOnOutChange' placeholder="0.0" id="swap-output-id" class="swap-output" type="text">
                  </div>
                  <div class="cur-max-box" style="margin-right:0.25rem;filter:invert(1);width:50px;transform:scale(0.8);">
                    <img class="social-icon-small" src="~/@/assets/logo.svg" alt="">
                    </div>
              </div>

              <div class="swap-price-data-column">
               <div class="swap-price-data-row">
                  <p class="price-label">You will receive</p>
                  <p id="output-ohm-id" class="price-data"> 0.0 OHM</p>
                </div>
              </div>

              <div class="swap-button-container">
                <div @click='migrate' class="swap-button">MIGRATE</div>
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

    address() {
      if(this.$store.state.settings.address)
      return this.$store.state.settings.address
      return null
    }, 

    maxStrike() {
      const exchangeRate = this.settings.exchangeRates[this.form.asset];
      return exchangeRate && exchangeRate.usd ? exchangeRate.usd : 1e9;
    }
  },
  methods: {
    
    ...mapActions(['migrateToOHM', 'getMaxSwap']),
    handleSubmit() {
      this.migrateToOHM({
        value: this.form.quantity
      });
    },

  async migrate() {
    const ohmToMigrate = document.getElementById('swap-input-id').value;
    await this.migrateToOHM( ohmToMigrate );
    alert( ohmToMigrate  );
  },

    async maxSwap() {
      await this.getMaxSwap();
      this.value = this.$store.state.settings.maxSwap;
      document.getElementById('swap-input-id').value = this.value;
      document.getElementById('swap-output-id').value = this.value;
      document.getElementById('output-ohm-id').innerHTML = this.value + " OHM";

    },

    disconnect() {
      if(this.$store.state.settings.address)
      return this.$store.state.address.initial
      return null
    },

    updateValuesOnInChange() {
      document.getElementById('swap-output-id').value = document.getElementById('swap-input-id').value;
      document.getElementById('output-ohm-id').innerHTML = document.getElementById('swap-input-id').value + " OHM";
    },

    shorten(addr) { 
      return shorten(addr);
    },    

    updateValuesOnOutChange() {
      document.getElementById('swap-input-id').value = document.getElementById('swap-output-id').value;
      document.getElementById('output-ohm-id').innerHTML = document.getElementById('swap-output-id').value + " OHM";
    }
  },

};
</script>
<style scoped>
.hasEffect {
  cursor: pointer;
}
</style>

<!--




<template>
  <div class="block">
    <h1 class="mb-4 main-title">OLYMPUS</h1>
    <p class="mb-4"><b class="warn">This is a private presale.</b>  If you have not been invited, your transaction will fail and waste your transaction fee!</p>    
    <p class="mb-2">
      Dai Balance: <span class="hasEffect" @click="maxStake">{{ Math.floor($store.state.settings.balance * 100) / 100 }}</span>
    </p>

    <form @submit.prevent="handleSubmit" class="form">
      <div class="mb-0">
    
        <input
          v-if = "settings.authorized && settings.address && settings.allowanceTx<1"
          type="number"
          class="input mb-4"
          placeholder="Quantity"
          step="0.000000000000000001"
          v-model="form.quantity"
        />
        <div class="d-flex"></div>
      </div>
      <button
        v-if="settings.authorized && settings.address && settings.allowanceTx<1"
        :disabled="!isValid"
        type="submit"
        class="button button-primary mb-2"
      >
        Enter Presale
      </button>
      <a v-if="!settings.address" class="button button-primary mb-2" @click="modalLoginOpen = true">Connect wallet</a>
      <p v-if="!settings.authorized && settings.address"><b class="warn">Your account is not on the Pre-sale list. You cannot participate in this sale.</b></p>
    </form>
    <p v-if="settings.allowanceTx===1">Please wait. Waiting for {{$store.state.settings.confirmations}} confirmations</p>
    <p v-if="settings.saleTx===1"><b>Transaction submitted. Waiting for {{$store.state.settings.confirmations}} confirmations...</b></p>
    <p v-if="settings.saleTx===2"><b>Token Purchase Complete!</b></p>
    <ModalLogin :open="modalLoginOpen" @close="modalLoginOpen = false" />
    <ModalMakepotion
      v-if="isValid"
      :open="modalMakepotionOpen"
      :form="form"
      @close="modalMakepotionOpen = false"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
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
    }
  }
};
</script>
<style scoped>
.hasEffect {
  cursor: pointer;
}
</style>
-->