<template>
       <div class="dapp-nav">
        <router-link :to="{ name: 'migrate' }" class="button button-dapp-menu">
          Migrate
        </router-link>
        <router-link :to="{ name: 'stake' }" class="button button-dapp-menu">
          Stake 
        </router-link>
        <router-link :to="{ name: 'bond' }" class="button button-dapp-menu">
          Bond (coming soon)
        </router-link>
        <router-link :to="{ name: 'dashboard' }" class="button button-dapp-menu">
          Dash (coming soon)
        </router-link>
        </div>
 
</template>

<script>

export default {

};
</script>
