<template>
  <div>
    <div id="dapp" class="dapp overflow-hidden" style="height:100% !important;">
      <div class="container-fluid">
        <div class="row">
          <Sidebar />

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
                    <iframe frameborder="0" src="https://duneanalytics.com/embeds/29778/60051/6328b87b-183e-4456-888d-d91048ff8cff" title="Market value of Treasury" style="height:400px;"></iframe>
                  </div>
                </div>
              </div>


            </div>


            <div class="row mt-3 mb-3">
              <div class="col-md-5 offset-md-1">
                <div class="card olympus-card" style="height:400px;">
                  <div class="card-body">
                    <iframe frameborder="0" src="https://duneanalytics.com/embeds/28286/57140/b0e3c522-8ace-47e8-8ac9-bc4ebf10b8c7" title="Total Value Staking" style="height:400px;"></iframe>
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
