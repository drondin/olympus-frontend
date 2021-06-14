<template>
  <div class="column">
    <div class="hero-block">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-lg-6">
            <h1 class="mb-4 main-title">A Decentralized Reserve Currency Protocol</h1>
            <h3 class="sub-title">Take back control of your investments, stake and earn interest. No more bank BS — you’re in control.</h3>
            <a href="https://app.olympusdao.finance/#/" class="button button-primary primary btn btn-lg button-centered">
              Enter App
            </a>
            <a href="https://app.olympusdao.finance/#/" class="button button-secondary secondary btn btn-lg button-centered">
              Documentation
            </a>
          </div>
          <div class="col-lg-6 d-none d-sm-block d-sm-none d-md-block d-md-none d-lg-block text-center">
<!--            <img src="~/@/assets/ohmie.png" class="ohmie" />-->
          </div>
        </div>

      </div>

    </div>

    <div class="block ohm-statistics text-center">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-4">
            <h2>Total Treasury Balance</h2>
            <h1>$17,590,059</h1>
          </div>
          <div class="col-xs-12 col-md-4 mt-5 mt-md-0">
            <h2>Current APY</h2>
            <h1>21,404%</h1>
          </div>
          <div class="col-xs-12 col-md-4 mt-5 mt-md-0">
            <h2>Ohmie Accounts</h2>
            <h1>4110</h1>
          </div>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      form: {
        quantity: ''
      },
      modalLoginOpen: false
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
  methods: {}
};
</script>
<style scoped>
.hasEffect {
  cursor: pointer;
}
</style>
