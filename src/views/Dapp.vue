<template>
  <div>
    <div id="dapp" class="overflow-hidden pb-6">
      <VueLoadingIndicator v-if="settings.loading" class="overlay big" />
      <div v-else>
      </div>
    </div>
  </div>
</template>

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
