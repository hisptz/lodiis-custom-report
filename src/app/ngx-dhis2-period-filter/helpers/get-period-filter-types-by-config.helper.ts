import { PeriodFilterType } from '../models/period-filter-type.model';
import { PeriodFilterConfig } from '../models/period-filter-config.model';
import { PeriodFilterTypes } from '../constants/period-filter-types.constant';

export function getPeriodFilterTypesByConfig(
  periodFilterTypes: PeriodFilterType[],
  periodFilterConfig: PeriodFilterConfig
): PeriodFilterType[] {
  if (!periodFilterConfig) {
    return periodFilterTypes;
  }

  return (periodFilterTypes || []).filter(
    (periodFilterType: PeriodFilterType) => {
      switch (periodFilterType.id) {
        case PeriodFilterTypes.FIXED:
          return periodFilterConfig.allowFixedPeriodSelection;
        case PeriodFilterTypes.RELATIVE:
          return periodFilterConfig.allowRelativePeriodSelection;
        case PeriodFilterTypes.DATE_RANGE:
          return periodFilterConfig.allowDateRangeSelection;
        default:
          return true;
      }
    }
  );
}
