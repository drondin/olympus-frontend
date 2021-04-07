<template>
  <div>
    <div id="dapp" class="dapp overflow-hidden" style="height:100% !important;">
      <!-- <VueLoadingIndicator v-if="settings.loading" class="overlay big" />
      <div v-else>
      </div>-->

      <div class="container-fluid">
        <div class="row">
          <div class="dapp-sidebar col-md-3 col-lg-2 d-md-block sidebar collapse">

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

          <div class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div class="row mt-3">
              <div class="col-md-3 offset-md-1">
                <div class="card olympus-card">
                  <div class="card-body">
                    <iframe frameborder="0" src="https://duneanalytics.com/embeds/28168/57095/a5003dd2-5680-42d4-a708-c0a7cbef87ba" title="Price"></iframe>
                  </div>
                </div>
              </div>


              <div class="col-md-4">
                <div class="card olympus-card">
                  <div class="card-body">
                    <iframe frameborder="0" src="https://duneanalytics.com/embeds/28707/57953/61c41a85-7bad-4a12-bcf6-9cfbb97ee785" title="Market Cap"></iframe>
                  </div>
                </div>
              </div>

              <div class="col-md-3">
                <div class="card olympus-card">
                  <div class="card-body">
                    <iframe frameborder="0" src="https://duneanalytics.com/embeds/28599/57711/ea91c246-fbb0-4138-8200-b943782d954c" title="Supply"></iframe>
                  </div>
                </div>
              </div>
            </div>


            <div class="row mt-3">
              <div class="col-md-5 offset-md-1">
                <div class="card olympus-card" style="height:400px;">
                  <div class="card-body">
                    <iframe frameborder="0" src="https://duneanalytics.com/embeds/29153/58862/af89fc7b-f1df-4dbd-a568-85bcdc49dd99" title="Treasury value in DAI" style="height:400px;"></iframe>
                  </div>
                </div>
              </div>
              <div class="col-md-5">
                <div class="card olympus-card" style="height:400px;">
                  <div class="card-body">
                    <iframe frameborder="0" src="https://duneanalytics.com/embeds/28286/57140/d3b6447c-f136-4fde-bdd9-c4e830b64dce" title="TVL" style="height:400px;"></iframe>
                  </div>
                </div>
              </div>
            </div>


            <div class="row mt-3">
              <div class="col-md-5 offset-md-1">
                <div class="card olympus-card" style="height:400px;">
                  <div class="card-body">
                    <iframe frameborder="0" src="https://duneanalytics.com/embeds/27661/55859/153510d7-7b3f-407b-bb07-c8735ac302a1" title="Holders over time" style="height:400px;"></iframe>
                  </div>
                </div>
              </div>
              <div class="col-md-5">
                <div class="card olympus-card" style="height:400px;">
                  <div class="card-body">
                    <iframe frameborder="0" src="https://duneanalytics.com/embeds/28756/58813/a3658bd2-39dc-4f19-bd2e-2a666c9d5b39" title="OHM staked/non-staked" style="height:400px;"></iframe>
                  </div>
                </div>
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
