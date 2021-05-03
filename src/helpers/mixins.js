import { trim, trimNumber, shorten } from '@/helpers/utils';
import { EPOCH_INTERVAL, BLOCK_RATE_SECONDS } from '@/helpers/constants';

export default {
  methods: {
    trim: function(number, precision) {
      return trim(number, precision);
    },
    trimNumber: function(number, precision) {
      return trimNumber(number, precision);
    },

    shortenAddress: function(address) {
      return shorten(address);
    },

    getRebaseBlock: function(currentBlock) {
      return currentBlock + EPOCH_INTERVAL - (currentBlock % EPOCH_INTERVAL);
    },

    secondsUntilBlock: function(startBlock, endBlock) {
      if (startBlock % EPOCH_INTERVAL === 0) {
        return 0;
      }

      const blocksAway = endBlock - startBlock;
      const secondsAway = blocksAway * BLOCK_RATE_SECONDS;

      return secondsAway;
    },

    prettyVestingPeriod: function(currentBlock, vestingBlock) {
      if (vestingBlock === 0) {
        return '';
      }

      const seconds = this.secondsUntilBlock(currentBlock, vestingBlock);
      if (seconds < 0) {
        return 'Fully Vested';
      } else {
        return this.prettifySeconds(seconds);
      }
    },

    prettifySeconds: function(seconds, resolution) {
      if (seconds !== 0 && !seconds) {
        return '';
      }

      const d = Math.floor(seconds / (3600*24));
      const h = Math.floor(seconds % (3600*24) / 3600);
      const m = Math.floor(seconds % 3600 / 60);
      const s = Math.floor(seconds % 60);


      if (resolution === 'day') {
        return d + (d == 1 ? " day" : " days");
      } else {
        const dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
        const hDisplay = h > 0 ? h + (h == 1 ? " hr, " : " hrs, ") : "";
        const mDisplay = m > 0 ? m + (m == 1 ? " min, " : " mins, ") : "";
        const sDisplay = s > 0 ? s + (s == 1 ? " sec" : " secs") : "";

        return dDisplay + hDisplay + mDisplay + sDisplay;
      }

    }
  }
};
