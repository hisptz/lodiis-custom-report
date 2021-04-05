import { createReducer, on } from '@ngrx/store';

import {
  loadDashboardData,
  addDashboardData,
  loadDashboardDataFail,
} from '../actions/dashboard.actions';
import {
  initialDashboardDataState,
  DashboardDataState,
} from '../states/dashboard.state';
import {
  loadingBaseState,
  loadedBaseState,
  errorBaseState,
} from '../states/base.state';

export const reducer = createReducer(
  initialDashboardDataState,
  on(loadDashboardData, (state) => ({
    ...state,
    ...loadingBaseState,
  })),
  on(addDashboardData, (state, { analytics }) => ({
    ...state,
    ...loadedBaseState,
    analytics,
  })),
  on(loadDashboardDataFail, (state, { error }) => ({
    ...state,
    ...errorBaseState,
    error,
  }))
);

export function dashboardDataReducer(
  state: any,
  action: any
): DashboardDataState {
  return reducer(state, action);
}
