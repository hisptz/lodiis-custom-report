import { BaseState, initialBaseState } from './base.state';
import { CurrentUser } from '../../shared/models/current-user.model';

export interface UserState extends BaseState {
  currentUser: CurrentUser;
}

export const initialUserState: UserState = {
  ...initialBaseState,
  currentUser: null,
};
