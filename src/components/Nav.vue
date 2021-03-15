<template>
  <nav>
    <div class="bg-topnav">
      <div class="container-lg p-responsive d-flex">
        <div class="">
          <router-link :to="{ name: 'home' }">
            <div class="row">
              <img src="~/@/assets/logo.svg" class="logo mt-4" /><h4 class="ticker-name">Olympus</h4>
              <h1 class="py-4">
              </h1>
            </div>
          </router-link>
        </div>
         <div class="mainnav">
      
      </div>

      <div class="py-4">
        <router-link :to="{ name: 'dapp' }" class="button button-primary">
          Enter App
        </router-link></div>
       <!-- <div class="py-4">
          <a v-if="address" class="button button-info">
            <span class="login-bullet mr-2 ml-n2" />
            {{ name || shorten(address) }}
          </a>
          <a v-else class="circle-button button button-primary" @click="modalLoginOpen = true">
            Connect wallet
          </a>
        </div> -->
      </div>
     
    </div>
    <ModalLogin :open="modalLoginOpen" @close="modalLoginOpen = false" />
  </nav>
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
