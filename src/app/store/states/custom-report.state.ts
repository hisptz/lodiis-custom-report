import { Report } from 'src/app/shared/models/report.model';
import { BaseState, initialBaseState } from './base.state';

export interface CustomReportState extends BaseState {
  isRefreshing: boolean;
  customReport: Report[];
}

export const initialCustomReportState: CustomReportState = {
  ...initialBaseState,
  isRefreshing: false,
  loading: true,
  customReport: [],
};
