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

              <div class="balance-row"><p>Balance</p><p class="balance-data">{{$store.state.settings.balance}}</p><p>DAI</p> </div>

              <div class="swap-input-row">
                <div class="swap-input-container">
                  <input @change="updateQuote" v-model='value' placeholder="0.0" class="swap-input" type="text">
                  
                  </div>

                  <div class="cur-max-box">
                    <img src="~/@/assets/dai.svg" alt="">
                    <div class="max-button" @click='maxAlloc'>
                      100%
                    </div>
                    </div>
              </div>

              <div class="swap-arrow">
                <img src="~/@/assets/Arrow.svg" alt="" class="social-icon-small">
              </div>

              <div class="swap-ourput-row">
                  <div class="swap-output-container">
                  <input  v-model='$store.state.settings.amount' placeholder="0.0" class="swap-output" type="text">
                  </div>
              </div>

              <div class="swap-price-data-column">
                <p>Note: This can only be done once.</p>
                <div class="swap-price-data-row">
                  <p class="price-label">Max Purchase</p>
                  <p class="price-data">{{$store.state.settings.allotment}} OHM</p>
                </div>
                <div class="swap-price-data-row">
                  
                  <p class="price-label">Current Price</p>
                  <p class="price-data">8 DAI</p>
                </div>
              </div>
            <span v-if='$store.state.settings.whitelisted == true'>
              <div v-if='hasAllowance' class="swap-button-container">
                <div class="swap-button" @click='sendDai'>SWAP</div>
              </div>
              <div v-else class="swap-button-container">
                <div class="swap-button" @click='seekApproval'>Approve</div>
              </div>
            </span>
            <span v-else>You are not whitelisted for the presale.</span>
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
import { ethers } from 'ethers';
import { shorten } from '@/helpers/utils.ts';

export default {
  data() {
    return {
      value: '',
      modalLoginOpen: false,
      modalMakepotionOpen: false
    };
  },
  computed: {
    ...mapState(['settings']),
    isValid() {
      return parseFloat(this.value);
    },
    maxStrike() {
      const exchangeRate = this.settings.exchangeRates[this.form.asset];
      return exchangeRate && exchangeRate.usd ? exchangeRate.usd : 1e9;
    },
    hasAllowance() {

      if(parseFloat(this.value)) {
        this.updateQuote();
        return parseInt(this.$store.state.settings.allowance) >= parseInt(ethers.utils.parseEther(this.value));
      }
      return false;
    },
    address() {
      if(this.$store.state.settings.address)
      return this.$store.state.settings.address
      return null
    }
  },
  methods: {
    
    ...mapActions(['getOHM', 'getApproval', 'calculateSaleQuote', 'getMaxPurchase']),
    shorten,
    async seekApproval() {
        await this.getApproval(this.value);
    },
    async sendDai() {
      await this.getOHM(this.value);
    },
    async updateQuote() {
      await this.calculateSaleQuote(this.value);
    },
    async maxAlloc() {
      await this.getMaxPurchase();
      this.value = this.$store.state.settings.maxPurchase;
      await this.updateQuote(); 
    }
  }
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
    <p class="mb-4"><b class="warn">This is a private presale. The price of each pOLY is 0.01 DAI.</b>  If you have not been invited, your transaction will fail and waste your transaction fee!</p>    
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
