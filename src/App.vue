<template>
  <div>
    <div id="app" class="overflow-hidden">
      <VueLoadingIndicator v-if="settings.loading" class="overlay big" />
      <div v-else>
                    <transition
              name="fade"
              mode="out-in">
<router-view :key="$route.path" />
            </transition>
      </div>
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
  computed: {
    ...mapState(['settings'])
  },
  methods: {
    ...mapActions(['init'])
  },
  async created() {
    this.init();
  }
};
</script>
