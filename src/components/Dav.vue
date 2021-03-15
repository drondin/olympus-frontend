<template>
  <dav>
     <div class="dapp-nav">

        <router-link :to="{ name: 'presale' }" class="button button-dapp-menu">
          Presale
        </router-link>
        <router-link :to="{ name: 'stake' }" class="button button-dapp-menu">
          Stake 
        </router-link>
        <router-link :to="{ name: 'bond' }" class="button button-dapp-menu">
          Bond 
        </router-link>
        <router-link :to="{ name: 'swap' }" class="button button-dapp-menu">
          Swap
        </router-link>
        <router-link :to="{ name: 'dashboard' }" class="button button-dapp-menu">
          Dash (coming soon)
        </router-link>
        </div>
 </dav>
</template>

<script>
import { mapState } from 'vuex';
import { shorten } from '@/helpers/utils';

export default {
  data() {
    return {
      modalLoginOpen: false
    };
  },

  computed: mapState({
    name: state => state.settings.name,
    address: state => state.settings.address
  }),
  methods: {
    shorten
  }
};
</script>
