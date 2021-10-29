import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { environment } from '../../../environments/environment';
import { SystemInfoState } from '../states/system-info.state';
import { UserState } from '../states/user.state';
import { systemInfoReducer } from './system-info.reducer';
import { userReducer } from './user.reducer';
import { ReportDataState } from '../states/report.state';
import { reportDataReducer } from './report.reducer';
import { GeneratedReportsState } from '../states/generated-reports.state';
import { generatedReportReducer } from './generated-report.reducer';
import { CustomReportState } from '../states/custom-report.state';
import { customReportReducer } from './custom-report.reducer';

export interface State {
  user: UserState;
  systemInfo: SystemInfoState;
  router: RouterReducerState;
  reportData: ReportDataState;
  generatedReports: GeneratedReportsState;
  customReportData: CustomReportState;
}

export const reducers: ActionReducerMap<State> = {
  user: userReducer,
  systemInfo: systemInfoReducer,
  router: routerReducer,
  reportData: reportDataReducer,
  generatedReports: generatedReportReducer,
  customReportData: customReportReducer,
};

export const metaReducers: MetaReducer<State>[] = !environment.production
  ? [storeFreeze]
  : [];

/**
 * Root state selector
 */
export const getRootState = (state: State) => state;
