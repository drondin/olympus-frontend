<template>
  <Modal :open="open" @close="$emit('close')">
    <div class="modal-body px-4">
      <div class="wallet-button" @click="handleProvider('metamask')">
        <div class="wallet-column py-4">
          <img src="~/@/assets/metamask.svg" height="53" class="mt-2 pt-1" />
          <div class="flex-auto py-2" style="color:black;">MetaMask</div>
          <div class="flex-auto" style="color:#c5c5c5">Connect to MetaMask</div>
        </div>
      </div>
      <div class="wallet-button" @click="handleProvider('walletconnect')">
        <div class="wallet-column py-4">
          <img src="~/@/assets/walletConnect.svg" height="53" class="mt-2 pt-1" />
          <div class="flex-auto py-2" style="color:black;">WalletConnect</div>
          <div class="flex-auto" style="color:#c5c5c5">Connect to WalletConnect</div>
        </div>
      </div>
      <VueLoadingIndicator v-if="isLoading" class="big" />
    </div>
  </Modal>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  props: ['open'],
  data() {
    return {
      isLoading: false
    };
  },
  computed: {},
  methods: {
    ...mapActions(['setProvider']),
    async handleProvider(providerName) {
      await this.setProvider({ providerName });
    }
  }
};
</script>
