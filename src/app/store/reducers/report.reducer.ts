import { createReducer, on } from '@ngrx/store';

import {
  LoadReportData,
  AddReportData,
  LoadReportDataFail,
} from '../actions/report.actions';
import {
  initialReportDataState,
  ReportDataState,
} from '../states/report.state';
import {
  loadingBaseState,
  loadedBaseState,
  errorBaseState,
} from '../states/base.state';

export const reducer = createReducer(
  initialReportDataState,
  on(LoadReportData, (state) => ({
    ...state,
    ...loadingBaseState,
  })),
  on(AddReportData, (state, { analytics }) => ({
    ...state,
    ...loadedBaseState,
    analytics,
  })),
  on(LoadReportDataFail, (state, { error }) => ({
    ...state,
    ...errorBaseState,
    error,
  }))
);

export function reportDataReducer(
  state: any,
  action: any
): ReportDataState {
  return reducer(state, action);
}
