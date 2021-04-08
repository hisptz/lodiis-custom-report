import { createSelector } from '@ngrx/store';
import { getRootState, State } from '../reducers';
import { ReportDataState } from '../states/report.state';

export const getReportState = createSelector(
  getRootState,
  (state: State) => state.reportData
);

export const getCurrentAnalytics = createSelector(
  getReportState,
  (state: ReportDataState) => state.analytics
);

export const getCurrentBufferProgess = createSelector(
  getReportState,
  (state: ReportDataState) => state.bufferProgress
);

export const getCurrentOverAllProgress = createSelector(
  getReportState,
  (state: ReportDataState) => state.overAllProgress
);

export const getCurrentAnalyticsLoadingStatus = createSelector(
  getReportState,
  (state: ReportDataState) => state.loading
);

export const getCurrentAnalyticsError = createSelector(
  getReportState,
  (state: ReportDataState) => state.error
);
