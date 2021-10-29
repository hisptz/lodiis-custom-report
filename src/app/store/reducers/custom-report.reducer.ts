import { createReducer, on } from '@ngrx/store';
import {
  AddCustomReport,
  DeleteCustomReport,
  EditCustomReport,
  LoadCustomReport,
  LoadSuccessCustomReport,
} from '../actions/custom-report.actions';
import {
  CustomReportState,
  initialCustomReportState,
} from '../states/custom-report.state';
import * as _ from 'lodash';

export const reducer = createReducer(
  initialCustomReportState,
  on(LoadCustomReport, (state) => ({
    ...state,
    loading: true,
    isRefreshing: false,
  })),
  on(AddCustomReport, (state, { report }) => ({
    ...state,
    isRefreshing: true,
  })),
  on(DeleteCustomReport, (state, { report }) => ({
    ...state,
    isRefreshing: true,
  })),

  on(LoadSuccessCustomReport, (state, { reports }) => ({
    ...state,
    customReport: [...reports],
    loading: false,
    isRefreshing: false,
  })),
  on(EditCustomReport, (state, { report }) => ({
    ...state,
    isRefreshing: true,
  }))
);

export function customReportReducer(
  state: CustomReportState,
  action: any
): CustomReportState {
  return reducer(state, action);
}
