<template>

  <div class="position-fixed top-0 end-0 p-3">
    <div :class="['toast', 'show', toast.color]" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header">
        <strong class="me-auto">{{toast.title}}</strong>
        <!-- <small>11 mins ago</small> -->
        <button type="button" class="btn-close" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        {{toast.body}}
      </div>
    </div>
  </div>

</template>

<script>
  export default {
    data() {
      return {};
    },

    mounted() {
      console.log("toast = ", this.toast)
    },

    props: ['toast'],
  };

</script>
