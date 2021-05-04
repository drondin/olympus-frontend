<template>
  <div class="position-fixed top-0 end-0 p-3">
    <div class="toast-container">
      <Toast v-for="toast in toasts" v-bind:key="toast.id" :toast="toast" />
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        toasts: this.$store.state.toasts
      };
    },

  };
</script>
