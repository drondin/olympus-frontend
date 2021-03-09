<template>
<div class="column">
  <div class="block hero">
    <div class="hero-icon"><img src="~/@/assets/logo.svg" alt=""></div>
    <h1 class="mb-4 main-title">An Algorithmic Currency </h1>
    <p class="centered-text hero-desc">Olympus utilizes Protocol Owned Value to enable price consistency and scarcity within an infinite supply system.</p>
   
  </div>
  <div class="block">
    <div class="row-responsive flex-centered">
      <h3 class="centered-text pb-8">Olympus Is</h3>
      </div>
    <div class="row-responsive flex-centered">

      <div class="feature-box-module" style="">
        <div class="feature-block-image">
          <img src="~/@/assets/Backedbyassets-banner.png" alt="">
          </div>
          <div class="feature-block-desc">
            <h3>Backed by Assets</h3>
            <p>Every OHM is backed by DAI and OHM-DAI LP in the treasury. This intrinsic value cannot be diluted, providing a fundamental check on inflation.</p>
          </div>
      </div>
      <div class="feature-box-module" style="">
        <div class="feature-block-image">
          <img src="~/@/assets/community-banner.png" alt="">
          </div>
          <div class="feature-block-desc">
            <h3>Algorithmically Managed</h3>
            <p>Olympus has an adjustable policy state, allowing the DAO to adjust parameters and algorithmically optimize for stability or growth.</p>
          </div>
      </div>
      <div class="feature-box-module" style="">
        <div class="feature-block-image">
          <img src="~/@/assets/community-banner.png" alt="">
          </div>
          <div class="feature-block-desc">
            <h3>Community Governed</h3>
            <p>Olympus is a DAO first project actively working toward complete distribution of the system to the community.</p>
          </div>
        </div>

    </div>
  </div>
  <div class="block row-responsive">
    <dif class="row-flex-max feature-row">
      <div class="row-flex-desc"><h2>What makes Olympus unique?</h2>
      <p>Olympus is a floating algorithmic currency. This means that it has mechanisms to promote stability and predictablility without directly pegging to any asset. However, we take it one step further with the introduction of adjustable policy; the DAO can move certain variables up and down to target growth and profitability or stability and predictability.</p>
      </div>
    </dif>
    <dv class="row-flex-image feature-image"><img src="~/@/assets/Whatmakesolyuniue.png" alt=""></dv>
  </div>
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

