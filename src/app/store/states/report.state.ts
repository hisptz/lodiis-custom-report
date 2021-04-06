import { BaseState, initialBaseState } from './base.state';

export interface ReportDataState extends BaseState {
  analytics: any;
}

export const initialReportDataState: ReportDataState = {
  ...initialBaseState,
  loading: false,
  analytics: null,
};
