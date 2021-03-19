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
 <div class="drop-menu-item">
   <h4>Developers</h4>
   <div class="drop-menu-hidden">
            <a href="https://ohmzeus.gitbook.io/olympus/"><p>Gitbook</p></a>
            <a href=""><p>Github</p></a>
   </div>
 </div>
 <div class="drop-menu-item">
   <h4>Learn</h4>
   <div class="drop-menu-hidden">
            <a href="#what">    
            <p>What is Olympus?</p>
            </a> 
        <a href="#how">
         <p>How it works</p>
        </a>
        <a href="https://olympusdao.medium.com/">
         <p>Blog</p>
          </a>

   </div>
 </div>
 <div class="drop-menu-item">
   <h4>Governance</h4>
   <div class="drop-menu-hidden">
            <router-link :to="{ name: 'vote' }" class="">
         <p>Vote</p>
        </router-link>
            <router-link :to="{ name: 'forum' }" class="">
         <p>Forum</p>
        </router-link>
   </div>
 </div>
 <div class="drop-menu-item">
   <h4>Community</h4>
   <div class="drop-menu-hidden">
            <a href="https://twitter.com/OlympusDAO"><p>Twitter</p></a>
            <a href="https://discord.gg/tmbtUpR6CF"><p>Discord</p></a>
            <a href="https://olympusdao.medium.com/"><p>Blog</p></a>
   </div>
 </div>
      </div>
   <!-- 
      <div class="py-4">
        <router-link :to="{ name: 'presale' }" class="button button-primary">
          Enter App
        </router-link></div>
         <div class="py-4">
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
