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
