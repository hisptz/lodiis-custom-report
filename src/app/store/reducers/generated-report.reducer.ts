import { createReducer, on } from '@ngrx/store';
import {
  LoadGeneratedReport,
  LoadGeneratedReportFail,
  LoadGeneratedReportSuccess,
} from '../actions';
import {
  errorBaseState,
  loadedBaseState,
  loadingBaseState,
} from '../states/base.state';
import {
  generatedReportAdapter,
  GeneratedReportsState,
  initialGeneratedReportsState,
} from '../states/generated-reports.state';

export const reducer = createReducer(
  initialGeneratedReportsState,
  on(LoadGeneratedReportSuccess, (state, { reports }) =>
    generatedReportAdapter.upsertMany(reports, { ...state, ...loadedBaseState })
  ),
  on(LoadGeneratedReport, (state) => ({ ...state, ...loadingBaseState })),
  on(LoadGeneratedReportFail, (state, { error }) => ({
    ...state,
    ...errorBaseState,
    error,
  }))
);

export function generatedReportReducer(state, action): GeneratedReportsState {
  return reducer(state, action);
}
