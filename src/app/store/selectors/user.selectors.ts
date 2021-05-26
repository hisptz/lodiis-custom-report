import { createSelector } from '@ngrx/store';
import { getRootState, State } from '../reducers';
import { UserState } from '../states/user.state';
import { User } from '@iapps/ngx-dhis2-http-client';
import * as _ from 'lodash';

export const getUserState = createSelector(
  getRootState,
  (state: State) => state.user
);

export const getCurrentUser = createSelector(
  getUserState,
  (state: UserState) => state.currentUser
);

export const getCurrentUserLoading = createSelector(
  getUserState,
  (state: UserState) => state.loading
);

export const getCurrentUserLoaded = createSelector(
  getUserState,
  (state: UserState) => state.loaded
);

export const getCurrentUserLoadingError = createSelector(
  getUserState,
  (state: UserState) => state.error
);

export const isCurrentUserHasCountryLevelOrganisationUnit = createSelector(
  getCurrentUser,
  (currentUser: User) => {
    console.log();
    const organisationUnits = currentUser ? _.flattenDeep(_.concat(
      currentUser.organisationUnits || [],
      currentUser.dataViewOrganisationUnits || []
    )) : [];
    const countryLevelOrganisationUnit = _.find(organisationUnits, organisationUnit=> organisationUnit.level && `${organisationUnit.level}` === "1");
    return countryLevelOrganisationUnit ? true : false;
  }
);

export const getCurrentUserOrganisationUnits = createSelector(
  getCurrentUser,
  (currentUser: User) => {
    return currentUser
      ? _.concat(
          currentUser.organisationUnits || [],
          currentUser.dataViewOrganisationUnits || []
        )
      : [];
  }
);

export const getCurrentUserManagementAuthoritiesStatus = createSelector(
  getCurrentUser,
  (currentUser: User) => {
    if (!currentUser) {
      return false;
    }

    return currentUser && currentUser.authorities
      ? currentUser.authorities.includes('ALL')
      : false;
  }
);
