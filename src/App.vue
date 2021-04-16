<template>
  <div>
    <div id="app" v-if="settings.loading">
      <VueLoadingIndicator  class="overlay big" />
    </div>

    <div id="app" class="overflow-hidden" v-else-if="$route.path == '/'">
      <transition name="fade" mode="out-in">
        <router-view :key="$route.path" />
      </transition>
    </div>

    <div id="app" v-else>
      <transition name="fade" mode="out-in">
        <div id="dapp" class="dapp min-vh-100">
          <div class="container-fluid">
            <div class="row">
              <nav class="navbar navbar-expand-lg navbar-light justify-content-end d-md-none">
                <button class="navbar-toggler" type="button" @click='toggleNavbar' aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                  <span class="navbar-toggler-icon"></span>
                </button>
              </nav>

              <Sidebar v-bind:isExpanded=$store.state.isSidebarExpanded />

              <div v-bind:class="[$store.state.isSidebarExpanded ? 'ohm-backdrop-show' : 'ohm-backdrop-close', 'ohm-backdrop']" @click='toggleNavbar'></div>

              <div class="col-lg-10 col-12 mt-4 mt-md-0">
                <router-view :key="$route.path" />
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>



  </div>



</template>
<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition-duration: 100ms;
    transition-property: opacity;
    transition-timing-function: ease;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0
  }
</style>
<script>
  import { mapState, mapActions } from 'vuex';

  export default {
    data() {
      return {}
    },
    computed: {
      ...mapState(['settings', 'constants'])
    },
    methods: {
      ...mapActions(['init']),
      toggleNavbar () {
        this.$store.commit('toggleSidebar', !this.$store.state.isSidebarExpanded)
      }
    },

    async created() {
      this.init();
    }
  };
</script>
