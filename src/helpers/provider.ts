import {providers} from 'ethers';
import WalletConnectProvider from '@walletconnect/web3-provider';
import WalletConnectQRCodeModal from '@walletconnect/qrcode-modal'


const provider = {
  walletConnect: async ():Promise<providers.Web3Provider> => {
    // Do we want to expose this provider object or is the ethers interface good enough??
    const provider = new WalletConnectProvider({
      infuraId: "be29ba1004a14966bee539713c939ca1",
    });

    await provider.enable();
    return new providers.Web3Provider(provider)
  },

  metamask: async ():Promise<providers.Web3Provider> => {
    if (!window['ethereum']) {
      throw new Error('Cannot create ethers instance');
    }
    // Don't need legacy window.web3.currentProvider support
    await window['ethereum'].enable();
    return new providers.Web3Provider(window['ethereum']);
  }
}

export default provider;
