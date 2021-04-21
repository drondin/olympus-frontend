import { trim, trimNumber } from '@/helpers/utils';

export default {
  methods: {
    trim: function(number, precision) {
      return trim(number, precision);
    },
    trimNumber: function(number, precision) {
      return trimNumber(number, precision);
    }
  }
};
