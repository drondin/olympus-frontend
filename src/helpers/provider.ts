import { providers } from 'ethers';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { getLocal, removeLocal, setLocal } from './local';

const PROVIDER_KEY = 'olympus-provider';
// TODO: this is a stopgap solution to access to provider across the codebase. Pls remove when refactoring.
// Declare provider on the window global.

declare global {
  interface Window {
    provider: any;
  }
}

const provider = {
  // Should be only called on app startup to load the provider from local storage to window.provider
  getLocalProviderName: function(): string {
    const localProvider = getLocal(PROVIDER_KEY);
    return localProvider;
  },
  setLocalProvider: function(providerName: string, providerClass: providers.Web3Provider) {
    window.provider = providerClass;
    return setLocal(PROVIDER_KEY, providerName); // Only store the provider name in local storage
  },
  clearLocalProvider: function() {
    window.provider = null;
    return removeLocal(PROVIDER_KEY);
  },
  walletConnect: async function() {
    // Do we want to expose this provider object or is the ethers interface good enough??
    const provider = new WalletConnectProvider({
      infuraId: 'be29ba1004a14966bee539713c939ca1'
    });

    await provider.enable();
    const web3Provider = new providers.Web3Provider(provider);
    this.setLocalProvider('walletconnect', web3Provider);
    return;
  },

  metamask: async function() {
    if (!window['ethereum']) {
      throw new Error('Cannot create ethers instance');
    }
    // Don't need legacy window.web3.currentProvider support
    await window['ethereum'].enable();
    const provider = new providers.Web3Provider(window['ethereum']);
    this.setLocalProvider('metamask', provider);
    return;
  }
};

export default provider;
