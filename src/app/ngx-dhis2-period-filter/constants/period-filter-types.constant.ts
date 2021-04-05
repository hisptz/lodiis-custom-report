import { PeriodFilterType } from '../models/period-filter-type.model';

export enum PeriodFilterTypes {
  FIXED = 'FIXED',
  RELATIVE = 'RELATIVE',
  DATE_RANGE = 'DATE_RANGE',
}

export const PERIOD_FILTER_TYPES: PeriodFilterType[] = [
  {
    id: PeriodFilterTypes.FIXED,
    name: 'Fixed Periods',
  },
  {
    id: PeriodFilterTypes.RELATIVE,
    name: 'Relative Periods',
  },
  {
    id: PeriodFilterTypes.DATE_RANGE,
    name: 'Date Range',
  },
];
