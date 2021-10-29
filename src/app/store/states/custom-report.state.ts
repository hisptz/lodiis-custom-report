import { Report } from 'src/app/shared/models/report.model';
import { BaseState, initialBaseState } from './base.state';

export interface CustomReportState extends BaseState {
  isEdited: boolean;
  isRefreshing: boolean;
  customReport: Report[];
}

export const initialCustomReportState: CustomReportState = {
  ...initialBaseState,
  isEdited: false,
  isRefreshing: false,
  loading: true,
  customReport: [],
};
