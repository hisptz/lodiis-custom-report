import { createSelector } from '@ngrx/store';
import { getRootState, State } from '../reducers';
import { ReportDataState } from '../states/report.state';

export const getUserState = createSelector(
  getRootState,
  (state: State) => state.reportData
);

export const getCurrentAnalytics = createSelector(
  getUserState,
  (state: ReportDataState) => state.analytics
);

export const getCurrentAnalyticsLoadingStatus = createSelector(
  getUserState,
  (state: ReportDataState) => state.loading
);

export const getCurrentAnalyticsError = createSelector(
  getUserState,
  (state: ReportDataState) => state.error
);
