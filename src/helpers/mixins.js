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

    prettifySeconds: function(seconds) {
      if (seconds !== 0 && !seconds) {
        return '';
      }

      if (seconds <= 60) {
        return seconds.toFixed(0).toString() + ' seconds';
      } else if (seconds <= 60 * 60) {
        const minutes = (seconds / 60).toFixed(0);
        return minutes.toString() + ' minutes';
      } else if (seconds <= 60 * 60 * 24) {
        const minutes = (seconds / 60 / 60).toFixed(1);
        return minutes.toString() + ' hours';
      } else {
        const days = (seconds / 60 / 60 / 24).toFixed(1);
        return days.toString() + ' days';
      }
    }
  }
};
