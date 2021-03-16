import { ethers } from 'ethers';
import provider from '@/helpers/provider';

const addresses = { 
    4: {
        DAI_ADDRESS: '0x84684f103952134fCc9327900D65bffFFE30D501',
        OHM_ADDRESS: '0x8887bbd1092802e80f5084d3d360911e25b9b487',
        STAKING_ADDRESS: '0x342f01b176e84e876d73ef3c5db9024cefb244e1',
        SOHM_ADDRESS: '0xe4911e147a6062ef4b9ba6e79e24a55e5191e412',
        PRESALE_ADDRESS: '0x90d1dd1fa2fddd5076850f342f31717a0556fdf7',  
    },
    1: {
        DAI_ADDRESS: '0x6b175474e89094c44da98b954eedeac495271d0f',
        OHM_ADDRESS: null,
        STAKING_ADDRESS: null,
        SOHM_ADDRESS: null,
        PRESALE_ADDRESS: '0x0e762067f824E9DB190aD3565E3bf8Cde314d893',  
    }
};

export default addresses;
