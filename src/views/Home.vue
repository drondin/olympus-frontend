<template>
<div class="column">
<Nav />
  <div class="block hero">
    <div class="hero-icon"><img src="~/@/assets/logo.svg" alt=""></div>
    <h1 class="mb-4 main-title">An Algorithmic Currency Protocol </h1>
    <p class="centered-text hero-desc">Olympus utilizes Protocol Owned Value to enable price consistency and scarcity within an infinite supply system.</p>
     <router-link :to="{ name: 'migrate' }" style="margin:2rem auto;max-width:200px;" class="button button-primary button-centered">
          Enter Olympus
        </router-link>
  </div>
  <div class="block">
    <div class="row-responsive flex-centered" id="what">
      <h3 class="centered-text py-8">Olympus Is</h3>
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
          <img src="~/@/assets/Algo--banner.png" alt="">
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
  <div class="block row-responsive no-pad">
    <dif class="row-flex-max feature-row">
      <div class="row-flex-desc"><h2>What makes Olympus unique?</h2>
      <p>Olympus is a floating algorithmic currency. This means that it has mechanisms to promote stability and predictablility without directly pegging to any asset. However, we take it one step further with the introduction of adjustable policy; the DAO can move certain variables up and down to target growth and profitability or stability and predictability.</p>
      </div>
    </dif>
    <div class="row-flex-image feature-image"><img src="~/@/assets/Whatmakesolyuniue.png" alt=""></div>
  </div>

  <div class="block">
    <div class="row-responsive flex-centered" id="how">
      <h3 class="centered-text py-8">How It Works</h3>
      </div>
    <div class="row-responsive flex-centered">
      <div class="works-module-responsive">
        <div class="works-icon"><img src="~/@/assets/coin.png" alt=""></div>
        <div class="works-desc">
          <h3>Reserves</h3>
          <p>OHM is always backed by one DAI or one OHM backed by one DAI. This creates a demand-based constraint on issuance of supply.</p>
        </div>

      </div>    
      <div class="works-module-responsive">
        <div class="works-icon"><img src="~/@/assets/graph.png" alt=""></div>
        <div class="works-desc">
          <h3>Market Operations</h3>
          <p>New OHM is created via direct sales into the market. These sales increase linearly with the market premium and produce profits for stakers.</p>
        </div>

      </div>

    </div>
    <div class="row-responsive flex-centered">
      <div class="works-module-responsive">
        <div class="works-icon"><img src="~/@/assets/pillars.png" alt=""></div>
        <div class="works-desc">
          <h3>Governance</h3>
          <p>The DAO controls policy tools that allow us to loosen, increasing profitability and volatility, or tighten, increasing stability and predictability.</p>
        </div>

      </div>    
      <div class="works-module-responsive">
        <div class="works-icon"><img src="~/@/assets/hand.png" alt=""></div>
        <div class="works-desc">
          <h3>Bonding</h3>
          <p>New OHM is created via deferred sales for LP. Bonders lock their LP for a vesting term and receive a discount on OHM when the trade ultimately occurs.</p>
        </div>

      </div>

    </div>
  </div>



  <div class="block row-responsive no-pad">
        <div class="row-flex-image feature-image"><img src="~/@/assets/worldofopp-image.png" alt=""></div>

    <dif class="row-flex-max feature-row">
      <div class="row-flex-desc"><h2>A world of opportunity</h2>
      <p>The Olympus reserve system enables new implementations of a multitude of DeFi primitives. Interest and liquidation-free leverage and borrowing, counterparty-free options and derivatives, trustless undercollateralized lending and more are possible. The future is bright.</p>
      </div>
    </dif>
  </div>

  <Footer />
  
  
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
    

  }
};
</script>
<style scoped>
.hasEffect {
  cursor: pointer;
}
</style>

