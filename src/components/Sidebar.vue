<template>
  <div v-bind:class="['col-md-3','col-lg-2', 'd-md-block', 'sidebar', 'collapse', {'show': isExpanded}]" id="sidebarContent">
    <div class="dapp-sidebar d-flex flex-column">
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

    <ModalLogin :open="modalLoginOpen" @close="modalLoginOpen = false" />
  </div>


</template>


<script>
  import { shorten } from '@/helpers/utils.ts';

  export default {
    data() {
      return {
        modalLoginOpen: false,
      };
    },
    props: ['isExpanded'],
    computed: {
      address() {
        if (this.$store.state.settings.address)
          return this.$store.state.settings.address
        return null
      },
    },

    methods: {
      shorten(addr) {
        return shorten(addr);
      },

      disconnect() {
        if(this.$store.state.settings.address)
        return this.$store.state.address.initial
        return null
      }
    }
  };

</script>
