import { createAction, props } from '@ngrx/store';
import { ErrorMessage } from '@iapps/ngx-dhis2-http-client';
import { CurrentUser } from 'src/app/shared/models/current-user.model';

export enum UserActionTypes {
  LoadCurrentUser = '[User] Load current User',
  AddCurrentUser = '[User] Add Current User',
  LoadCurrentUserFail = '[User] Load Current User fail',
}

export const loadCurrentUser = createAction('[User] Load current User');

export const addCurrentUser = createAction(
  '[User] Add Current User',
  props<{ currentUser: CurrentUser }>()
);

export const loadCurrentUserFail = createAction(
  '[User] Load Current User fail',
  props<{ error: ErrorMessage }>()
);
