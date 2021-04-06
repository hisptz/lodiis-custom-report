import { createAction, props } from '@ngrx/store';
import { ErrorMessage } from '@iapps/ngx-dhis2-http-client';

export enum DashboardActionTypes {
  LoadDashboardData = '[Dashboard] Load dashboard data',
  AddDashboardData = '[Dashboard] Add Dashboard data',
  LoadDashboardDataFail = '[Dashboard] Load Dashboard data fail',
}

export const loadDashboardData = createAction(
  '[Dashboard] Load Dashboard data',
  props<{ analyticParameters : Array<any>, reportConfig:any }>()
);

export const addDashboardData = createAction(
  '[Dashboard] Add Dashboard data',
  props<{ analytics: any }>()
);

export const loadDashboardDataFail = createAction(
  '[Dashboard] Load Dashboard data fail',
  props<{ error: ErrorMessage }>()
);
