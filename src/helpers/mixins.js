import { trim, trimNumber } from '@/helpers/utils';

export default {
  methods: {
    trim: function(number, precision) {
      return trim(number, precision);
    },
    trimNumber: function(number, precision) {
      return trimNumber(number, precision);
    },
    prettifySeconds: function(seconds) {
      if (seconds !== 0 && !seconds) {
        return "";
      }

      if (seconds <= 60) {
        return seconds.toFixed(0).toString() + " seconds"
      } else if (seconds <= 60 * 60) {
        const minutes = (seconds / 60).toFixed(0);
        return minutes.toString() + " minutes"
      } else if (seconds <= 60 * 60 * 24) {
        const minutes = (seconds / 60 / 60).toFixed(1);
        return minutes.toString() + " hours"
      } else {
        const days = (seconds / 60 / 60 / 24).toFixed(1);
        return days.toString() + " days"
      }
    }
  }
};
