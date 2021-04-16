<template>
  <nav>
    <div class="bg-topnav">
      <div class="container-lg p-responsive d-flex">
        <router-link :to="{ name: 'home' }" class="navbar-brand d-flex align-items-center">
          <img src="~/@/assets/logo.svg" class="logo" /><h4 class="ticker-name">Olympus</h4>
          <h1 class="py-4"></h1>
        </router-link>

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
              <a href="http://vote.olympusdao.finance/">
               <p>Vote</p>
              </a>
              <a href="https://forum.olympusdao.finance">
               <p>Forum</p>
              </a>
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
