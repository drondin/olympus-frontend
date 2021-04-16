<template>
  <footer>

    <div class="footer-row">

    <div class="footer-icon" >
              <img src="~/@/assets/logo.svg" class="logo" />
    </div>

    <div class="footer-menu">
        <div class="footer-menu-column">
            <h4>Developers</h4>
            <a href="https://ohmzeus.gitbook.io/olympus/"><p>Gitbook</p></a>
            <a href=""><p>Github</p></a>
        </div>
        <div class="footer-menu-column">
            <h4>Learn</h4>
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
        <div class="footer-menu-column">
            <h4>Governance</h4>
            <router-link :to="{ name: 'vote' }" class="">
         <p>Vote</p>
        </router-link>
            <router-link :to="{ name: 'forum' }" class="">
         <p>Forum</p>
        </router-link>

        </div>
        <div class="footer-menu-column">
            <h4>Community</h4>
            <a href="https://twitter.com/OlympusDAO"><p>Twitter</p></a>
            <a href="https://discord.gg/tmbtUpR6CF"><p>Discord</p></a>
            <a href="https://olympusdao.medium.com/"><p>Blog</p></a>
        </div>

    </div>


    <div class="footer-app-button">
      <router-link :to="{ name: 'migrate' }" class="button button-primary" style="color: black !important;">
        Enter App
      </router-link>
    </div>



    </div>
    <ModalLogin :open="modalLoginOpen" @close="modalLoginOpen = false" />
  </footer>
</template>

<script>
import { mapState } from 'vuex';
import { shorten } from '@/helpers/utils';
//import useSound from 'vue-use-sound'
//import buttonSfx from '../assets/stakebutton.mp3'

export default {
  //setup() {d
  //  const [play] = useSound(buttonSfx)

  //  return {
  //    play,
  //  }
  //},
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
