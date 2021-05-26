import { PeriodFilterTypes } from '../constants/period-filter-types.constant';

export function getCurrentPeriodFilterType(
  periodFilterTypes: any[],
  selectedPeriodType
) {
  /**
   * Pick the filter period filter type If there are multiple period filter types
   */
  if (periodFilterTypes && periodFilterTypes.length > 0) {
    return periodFilterTypes[0].id;
  }

  if (selectedPeriodType) {
    /**
     * Check if period filter type is period range
     */
    if (selectedPeriodType.indexOf('Range') !== -1) {
      return PeriodFilterTypes.DATE_RANGE;
    }

    /**
     * Check if period filter type is relative
     */
    if (selectedPeriodType.indexOf('Relative') !== -1) {
      return PeriodFilterTypes.RELATIVE;
    }

    /**
     * Check if period filter type is fixed
     */
    if (selectedPeriodType.indexOf('Fixed') !== -1) {
      return PeriodFilterTypes.FIXED;
    }
  }

  return PeriodFilterTypes.RELATIVE;
}
