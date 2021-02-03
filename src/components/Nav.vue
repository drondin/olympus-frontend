<template>
  <nav>
    <div class="bg-topnav">
      <div class="container-lg p-responsive d-flex">
        <div class="flex-auto text-left">
          <router-link :to="{ name: 'home' }">
            <div class="row">
              <img src="~/@/assets/logo.svg" class="logo mt-4" />
              <h1 class="py-4">
              </h1>
            </div>
          </router-link>
        </div>
        <div class="py-4">
          <a v-if="address" class="button button-info">
            <span class="login-bullet mr-2 ml-n2" />
            {{ name || shorten(address) }}
          </a>
          <a v-else class="circle-button button button-primary" @click="modalLoginOpen = true">
            Connect wallet
          </a>
        </div>
      </div>
     
    </div>
    <div class="mb-4 mt-4">
 <!-- <div class="mainnav">
        <router-link :to="{ name: 'home' }" class="button button-secondary">
          Home
        </router-link>
        <router-link :to="{ name: 'presale' }" class="button button-secondary">
          Presale
        </router-link>
        <router-link :to="{ name: 'projects' }" class="button button-secondary">
          Projects
        </router-link>
      </div> -->
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
