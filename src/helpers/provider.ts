import {providers} from 'ethers';
import WalletConnectProvider from '@walletconnect/web3-provider';


const provider = {
  walletConnect: async () => {
    // Do we want to expose this provider object or is the ethers interface good enough??
    const provider = new WalletConnectProvider({
      infuraId: "be29ba1004a14966bee539713c939ca1", 
    });

    await provider.enable();
    return new providers.Web3Provider(provider)
  },

  metamask: async () => {
    if (!window['ethereum']) {
      throw new Error('Cannot create ethers instance');
    }
    // Don't need legacy window.web3.currentProvider support
    await window['ethereum'].enable();
    return new providers.Web3Provider(window['ethereum']);
  }
}

export default provider;
