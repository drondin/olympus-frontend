import { ethers } from 'ethers';
import provider from '@/helpers/provider';

const addresses = { 
    4: {
        DAI_ADDRESS: '0x84684f103952134fCc9327900D65bffFFE30D501',
        OHM_ADDRESS: '0x4E7259A515AbbcBCd6c8d17F73bA8acdd2B0Ed9d',
        STAKING_ADDRESS: '0x9fE811734D31e96bBA0b88aDf9eCca500f21784F',
        SOHM_ADDRESS: '0xCe5259c5B9960B76953D53eFCE8e6527A4393Eb9',
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
