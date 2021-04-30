import { ErrorMessage } from '@iapps/ngx-dhis2-http-client';
import { createAction, props } from '@ngrx/store';
import { GeneratedReport } from '../../shared/models/generated-report.model';

export enum GeneratedReportActionTypes {
  LoadGeneratedReport = '[Report] Load generated report',
  LoadGeneratedReportSuccess = '[Report] Load generated report success',
  LoadGeneratedReportFail = '[Report] Load generated report fail',
}

export const LoadGeneratedReport = createAction(
  GeneratedReportActionTypes.LoadGeneratedReport
);

export const LoadGeneratedReportSuccess = createAction(
  GeneratedReportActionTypes.LoadGeneratedReportSuccess,
  props<{ reports: Array<GeneratedReport> }>()
);

export const LoadGeneratedReportFail = createAction(
  GeneratedReportActionTypes.LoadGeneratedReportFail,
  props<{ error: ErrorMessage }>()
);
