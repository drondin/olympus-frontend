<template>
  <nav class="navbar navbar-dark bg-light py-2" style="width:100%;">
    <div class="container-fluid" style="max-width: 80%;">
      <router-link :to="{ name: 'home' }" class="navbar-brand d-flex align-items-center">
        <img src="~/@/assets/logo.svg" class="logo" />
        <img src="~/@/assets/ohm-logo.svg" class="logo" />
        <h4 class="ticker-name">Olympus</h4>
        <h1 class="py-4"></h1>
      </router-link>

      <ul class="navbar-nav mb-2 mb-lg-0 d-flex flex-row float-right">
        <li class="nav-item drop-menu-item">
          <h4>Products</h4>
          <div class="drop-menu-hidden">
            <a href="https://docs.olympusdao.finance/basics/staking">
              <p>Stake</p>
            </a>
            <a href="https://docs.olympusdao.finance/basics/bonding">
              <p>Bond</p>
            </a>
          </div>
        </li>

        <li class="nav-item drop-menu-item">
          <h4>Governance</h4>
          <div class="drop-menu-hidden">
            <a href="http://vote.olympusdao.finance/">
              <p>Vote</p>
            </a>
            <a href="https://forum.olympusdao.finance">
              <p>Forum</p>
            </a>
          </div>
        </li>

        <li class="nav-item drop-menu-item">
          <h4>
            <a href="https://docs.olympusdao.finance" style="padding: 54px 68px">Docs</a>
          </h4>
        </li>

        <li class="nav-item drop-menu-item highlight">
          <h4>
            <a href="https://app.olympusdao.finance/#/"  style="padding: 54px 50px">
              Enter App
            </a>
          </h4>
        </li>

          <li class="nav-item drop-menu-item">
          <h4>Social</h4>
          <div class="drop-menu-hidden">
            <a href="https://twitter.com/OlympusDAO" target="_blank">
              <p>Twitter</p>
            </a>
            <a href="https://discord.gg/6QjjtUcfM4" target="_blank">
              <p>Discord</p>
            </a>
            <a href="https://github.com/OlympusDAO/" target="_blank">
              <p>Github</p>
            </a>
            <a href="https://olympusdao.medium.com/" target="_blank">
              <p>Medium</p>
            </a>
          </div>
        </li>

<!--        <li class="nav-item drop-menu-item">-->
<!--          <h4>-->
<!--            <a role="button" @click="clickedGetOHM" href="https://app.sushi.com/swap?inputCurrency=0x6b175474e89094c44da98b954eedeac495271d0f&outputCurrency=0x383518188c0c6d7730d91b2c03a03c837814a899" target="_blank">-->
<!--              Get OHM-->
<!--            </a>-->
<!--          </h4>-->
<!--        </li>-->

      </ul>




    </div>






    <ModalLogin :open="modalLoginOpen" @close="modalLoginOpen = false" />
  </nav>
</template>

<script>
import { mapState } from 'vuex';

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
    clickedGetOHM(evt) {
      window.analytics.track("Clicked Button", {button: 'Get OHM'})
    }

  }
};
</script>
