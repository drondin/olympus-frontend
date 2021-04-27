<template>
  <div class="container-fluid mt-4">
    <div class="row mt-4">
      <div class="col-sm-4 mb-2 mb-sm-0">
        <div class="card ohm-dashboard-card">
          <div class="card-body">
            <h4 class="card-title">Price</h4>
            <div class="my-auto">
              <h1 class="text-center">
                {{
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    maximumFractionDigits: 2
                  }).format($store.state.analytics.currentPrice)
                }}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div class="col-sm-4 mb-2 mb-sm-0">
        <div class="card ohm-dashboard-card">
          <div class="card-body">
            <h4 class="card-title">Market Cap</h4>
            <h1 class="text-center">
              {{
                new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0
                }).format($store.state.analytics.marketCap)
              }}
            </h1>
          </div>
        </div>
      </div>

      <div class="col-sm-4 mb-2 mb-sm-0">
        <div class="card ohm-dashboard-card">
          <div class="card-body">
            <h4 class="card-title">Supply (circulating/total)</h4>
            <h1 class="text-center">
              {{
                new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(
                  $store.state.analytics.circulatingSupply
                )
              }}
              /
              {{
                new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(
                  $store.state.analytics.maxSupply
                )
              }}
            </h1>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col-sm-6 mb-2 mb-sm-0">
        <div class="card olympus-card">
          <div class="card-body">
            <iframe
              frameborder="0"
              src="https://duneanalytics.com/embeds/28286/57140/b0e3c522-8ace-47e8-8ac9-bc4ebf10b8c7"
              title="Total Value Staking"
              style="height:400px;"
            ></iframe>
          </div>
        </div>
      </div>

      <div class="col-sm-6 mb-2 mb-sm-0">
        <div class="card olympus-card">
          <div class="card-body">
            <iframe
              frameborder="0"
              src="https://duneanalytics.com/embeds/29778/60051/6328b87b-183e-4456-888d-d91048ff8cff"
              title="Market value of Treasury"
              style="height:400px;"
            ></iframe>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-4 mb-4">
      <div class="col-sm-6 mb-2 mb-sm-0">
        <div class="card olympus-card">
          <div class="card-body">
            <iframe
              frameborder="0"
              src="https://duneanalytics.com/embeds/29815/60140/0be45969-dfc2-4625-9b48-d7af19a45546"
              title="Total Value Staking"
              style="height:400px;"
            ></iframe>
          </div>
        </div>
      </div>
      <div class="col-sm-6 mb-2 mb-sm-0">
        <div class="card olympus-card">
          <div class="card-body">
            <iframe
              frameborder="0"
              src="https://duneanalytics.com/embeds/28756/58813/a3658bd2-39dc-4f19-bd2e-2a666c9d5b39"
              title="OHM staked/non-staked"
              style="height:400px;"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(['analytics'])
  },
  methods: {
    ...mapActions(['getCoingeckoData']),

    formatCurrency(value) {
      return this.formatCurrency(value);
    }
  },
  async created() {
    this.getCoingeckoData();
  }
};
</script>
