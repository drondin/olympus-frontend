import { ethers } from 'ethers';
import provider from '@/helpers/provider';

const addresses = { 
    4: {
        DAI_ADDRESS: '0x84684f103952134fCc9327900D65bffFFE30D501',
        OHM_ADDRESS: '0x399Dc33B5e38c5FC0913F4EBD9aB5cD42fEAA14D',
        STAKING_ADDRESS: '0xEF4d1248D736f033908bcc034e8B8155885488E0',
        SOHM_ADDRESS: '0x42B38e25E3112e224503F881eA237aF201B814DD',
        PRESALE_ADDRESS: '0x90d1dd1fa2fddd5076850f342f31717a0556fdf7',  
    },
    1: {
        DAI_ADDRESS: '0x6b175474e89094c44da98b954eedeac495271d0f',
        OHM_ADDRESS: null,
        STAKING_ADDRESS: null,
        SOHM_ADDRESS: null,
        PRESALE_ADDRESS: '0xcBb60264fe0AC96B0EFa0145A9709A825afa17D8',  
    }
};

export default addresses;
