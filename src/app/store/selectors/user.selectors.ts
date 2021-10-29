import { createSelector } from '@ngrx/store';
import { getRootState, State } from '../reducers';
import { UserState } from '../states/user.state';
import * as _ from 'lodash';
import { CurrentUser } from '../../shared/models/current-user.model';

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
  (currentUser: CurrentUser) => {
    const organisationUnits = currentUser
      ? _.flattenDeep(
          _.concat(
            currentUser.organisationUnits || [],
            currentUser.dataViewOrganisationUnits || []
          )
        )
      : [];
    const countryLevelOrganisationUnit = _.find(
      organisationUnits,
      (organisationUnit) =>
        organisationUnit.level && `${organisationUnit.level}` === '1'
    );
    return countryLevelOrganisationUnit ? true : false;
  }
);

export const getCurrentUserOrganisationUnits = createSelector(
  getCurrentUser,
  (currentUser: CurrentUser) => {
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
  (currentUser: CurrentUser) => {
    if (!currentUser) {
      return false;
    }

    return currentUser && currentUser.authorities
      ? currentUser.authorities.includes('ALL')
      : false;
  }
);

export const getCurrentUserAccessToReportConfiguration = createSelector(
  getCurrentUser,
  (currentUser: CurrentUser) => {
    let hasAccess = false;
    const rolesIdAllowed: string[] = ['yrB6vc5Ip3r', 'jv5X0x0A0xy'];

    if (currentUser && (currentUser.authorities ?? [].includes('ALL'))) {
      hasAccess = true;
    } else if (currentUser && currentUser.userCredentials) {
      (currentUser.userCredentials['userRoles'] ?? []).forEach(
        (userObjectRoleId) => {
          if (rolesIdAllowed.includes(userObjectRoleId)) {
            hasAccess = true;
          } else {
            hasAccess = false;
          }
        }
      );
    }

    return hasAccess;
  }
);

export const getCurrentUserImplementingPartner = createSelector(
  getCurrentUser,
  (currentUser: CurrentUser) => {
    const implementingPartnerAttributeId = 'wpiLo7DTwKF';
    let implementingPartnerId = '';
    const userAttribute = _.find(
      currentUser ? currentUser.attributeValues || [] : [],
      (dataObject: any) =>
        dataObject &&
        dataObject.attribute &&
        dataObject.attribute.id &&
        dataObject.attribute.id === implementingPartnerAttributeId
    );

    implementingPartnerId =
      userAttribute && userAttribute.hasOwnProperty('value')
        ? userAttribute.value
        : implementingPartnerId;

    return implementingPartnerId;
  }
);
