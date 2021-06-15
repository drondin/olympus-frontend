<template>
  <div class="column">

    <div class="hero-block">
      <nav class="navbar navbar-expand-md py-2" role="navigation">
        <div class="container-fluid" style="max-width: 80%;">
          <router-link :to="{ name: 'home' }" class="navbar-brand align-items-center">
<!--            <img src="~/@/assets/logo.svg" class="logo" />-->
            <img src="~/@/assets/ohm-logo.svg" class="logo" />
          </router-link>

          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#OhmNavBarNav" aria-controls="OhmNavBarNav" aria-expanded="false" aria-label="Toggle navigation">
<!--            <span class="navbar-toggler-icon"></span>-->
            <img src="~/@/assets/mobile-menu.png" />
          </button>

          <div class="collapse navbar-collapse justify-content-end" id="OhmNavBarNav">
            <ul class="nav navbar-nav">
              <li class="nav-item dropdown">
                <a class="nav-link" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Products</a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="https://docs.olympusdao.finance/basics/staking">Stake</a></li>
                  <li><a class="dropdown-item" href="https://docs.olympusdao.finance/basics/bonding">Bond</a></li>
                </ul>
              </li>

                <li class="nav-item dropdown">
                  <a class="nav-link" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Governance</a>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="https://forum.olympusdao.finance">Forum</a></li>
                    <li><a class="dropdown-item" href="http://vote.olympusdao.finance">Vote</a></li>
                  </ul>
                </li>

              <li class="nav-item dropdown">
                <a class="nav-link" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Social</a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="https://twitter.com/OlympusDAO">Twitter</a></li>
                  <li><a class="dropdown-item" href="https://discord.gg/6QjjtUcfM4">Discord</a></li>
                  <li><a class="dropdown-item" href="https://github.com/OlympusDAO">Github</a></li>
                  <li><a class="dropdown-item" href="https://olympusdao.medium.com">Medium</a></li>
                  <li><a class="dropdown-item" href="https://defipulse.com/">DeFi Pulse</a></li>
                </ul>
              </li>

              <li class="nav-item dropdown">
                <a class="nav-link" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Docs</a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="https://docs.olympusdao.finance">Docs</a></li>
                </ul>
              </li>

            </ul>
          </div>
        </div>
      </nav>
      <div class="container">

        <div class="row">
          <div class="col-xs-12 col-lg-6">
            <h1 class="mb-4 main-title">The Decentralized Reserve Currency</h1>
            <h3 class="sub-title">Financial tools to grow your wealth — stake and earn compounding interest.</h3>
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
