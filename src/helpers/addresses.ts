import { ethers } from 'ethers';
import provider from '@/helpers/provider';

const addresses = { 
    4: {
        DAI_ADDRESS: '0xFd08f094B0eFe901aD95B650A382fc6468b374de',
        OHM_ADDRESS: '0x022D82Bf12337fa8b70Ec759833b66dc4d916f41',
        STAKING_ADDRESS: '0xA33a1015847569221f7613E89BB463AE6d628799',
        SOHM_ADDRESS: '0x83b334767f0C60C01938e695288ada176Ae03C6B',
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
