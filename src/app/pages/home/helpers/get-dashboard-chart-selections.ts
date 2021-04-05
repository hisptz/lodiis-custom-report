import * as _ from 'lodash';

export function getDefaultOrganisationUnitSelections(userOrgnisationUnits) {
  return userOrgnisationUnits && userOrgnisationUnits.length > 0
    ? _.uniqBy(userOrgnisationUnits, 'id')
    : [];
}

export function getDefaultPeriodSelections(today?: Date) {
  const date = today ? new Date(today) : new Date();
  const monthIndex = date.getMonth();
  const currentYear = date.getFullYear();
  const id =
    monthIndex >= 3 && monthIndex <= 8
      ? `${currentYear - 1}AprilS2`
      : `${currentYear}AprilS1`;
  return [{ id, type: 'SixMonthlyApril' }];
}
