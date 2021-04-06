import { createAction, props } from '@ngrx/store';
import { ErrorMessage } from '@iapps/ngx-dhis2-http-client';

export enum ReportActionTypes {
  LoadReportData = '[Report] Load Report data',
  AddReportData = '[Report] Add Report data',
  LoadReportDataFail = '[Report] Load Report data fail',
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
