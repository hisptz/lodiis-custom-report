import { BaseState, initialBaseState } from './base.state';

export interface ReportDataState extends BaseState {
  analytics: any;
  bufferProgress : number,
  overAllProgress : number,
}

export const initialReportDataState: ReportDataState = {
  ...initialBaseState,
  loading: false,
  analytics: null,
  bufferProgress : 0,
  overAllProgress : 0,
};
