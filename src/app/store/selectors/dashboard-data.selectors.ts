import { createSelector } from '@ngrx/store';
import { getRootState, State } from '../reducers';
import { DashboardDataState } from '../states/dashboard.state';

export const getUserState = createSelector(
  getRootState,
  (state: State) => state.dasboardData
);

export const getCurrentAnalytics = createSelector(
  getUserState,
  (state: DashboardDataState) => state.analytics
);

export const getCurrentAnalyticsLoadingStatus = createSelector(
  getUserState,
  (state: DashboardDataState) => state.loading
);

export const getCurrentAnalyticsError = createSelector(
  getUserState,
  (state: DashboardDataState) => state.error
);
