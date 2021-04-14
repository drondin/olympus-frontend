<template>
  <div id="app" class="overflow-hidden">
    <VueLoadingIndicator v-if="settings.loading" class="overlay big" />
    <div v-else-if="$route.path == '/'">
      <transition name="fade" mode="out-in">
        <router-view :key="$route.path" />
      </transition>
    </div>
    <div v-else>
      <transition name="fade" mode="out-in">
        <div id="dapp" class="dapp overflow-hidden">
          <div class="container-fluid h-100">
            <div class="row h-100">
              <nav class="navbar navbar-expand-lg navbar-light justify-content-end d-md-none">
                <button class="navbar-toggler" type="button" @click='toggleNavbar' aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                  <span class="navbar-toggler-icon"></span>
                </button>
              </nav>

              <Sidebar v-bind:isExpanded=$store.state.isSidebarExpanded />

              <div v-bind:class="[$store.state.isSidebarExpanded ? 'ohm-backdrop-show' : 'ohm-backdrop-close', 'ohm-backdrop']" @click='toggleNavbar'></div>

              <div class="col-lg-10 col-12 mt-4 mt-md-0 overflow-auto min-vh-100">
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
