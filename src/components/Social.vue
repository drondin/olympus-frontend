<template>
<social>
     <div class="social-row">
            <a href=""><img src="~/@/assets/github.svg" alt="" class="social-icon-small"></a>
            <a href=""><img src="~/@/assets/medium.svg" alt="" class="social-icon-small"></a>
            <a href=""><img src="~/@/assets/twitter.svg" alt="" class="social-icon-small"></a>
            <a href=""><img src="~/@/assets/discord.svg" alt="" class="social-icon-small"></a>
          </div>
</social>
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
