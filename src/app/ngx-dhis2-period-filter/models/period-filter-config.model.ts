export interface PeriodFilterConfig {
  resetOnPeriodTypeChange?: boolean;
  emitOnSelection?: boolean;
  emitOnDestroy?: boolean;
  singleSelection?: boolean;
  childrenPeriodSortOrder?: string;
  disablePeriodTypeSelection?: boolean;
  lowestPeriodType?: string;
  allowFixedPeriodSelection?: boolean;
  allowRelativePeriodSelection?: boolean;
  allowDateRangeSelection?: boolean;
  hideActionButtons?: boolean;
  contentHeight?: string;
}
