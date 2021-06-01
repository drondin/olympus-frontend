<template>
  <div class="dapp-nav">
    <a href="https://app.olympusdao.finance/#/dashboard" class="button button-dapp-menu">
      Dashboard
    </a>

    <a href="https://app.olympusdao.finance/#/" class="button button-dapp-menu">
      Stake
    </a>

    <a href="https://app.olympusdao.finance/#/bonds" class="button button-dapp-menu">
      Bond
    </a>

    <router-link :to="{ name: 'lpstake' }" class="button button-dapp-menu">
      LP Staking
    </router-link>
  </div>
</template>

<script>
export default {};
</script>
