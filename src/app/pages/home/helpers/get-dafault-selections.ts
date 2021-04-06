import * as _ from 'lodash';

export function getDefaultOrganisationUnitSelections(userOrgnisationUnits) {
  return userOrgnisationUnits && userOrgnisationUnits.length > 0
    ? _.uniqBy(userOrgnisationUnits, 'id')
    : [];
}
