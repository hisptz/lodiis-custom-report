import { createAction, props } from '@ngrx/store';
import { ErrorMessage } from '@iapps/ngx-dhis2-http-client';

export enum ReportActionTypes {
  LoadReportData = '[Dashboard] Load dashboard data',
  AddReportData = '[Dashboard] Add Dashboard data',
  LoadReportDataFail = '[Dashboard] Load Dashboard data fail',
}

export const LoadReportData = createAction(
  ReportActionTypes.LoadReportData,
  props<{ analyticParameters : Array<any>, reportConfig:any }>()
);

export const AddReportData = createAction(
  ReportActionTypes.AddReportData,
  props<{ analytics: any }>()
);

export const LoadReportDataFail = createAction(
  ReportActionTypes.LoadReportDataFail,
  props<{ error: ErrorMessage }>()
);
