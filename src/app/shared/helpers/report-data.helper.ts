import * as _ from 'lodash';
import { getFormattedDate } from 'src/app/core/utils/date-formatter.util';

const defaultAnalyticKeys = [
  'eventdate',
  'enrollmentdate',
  'tei',
  'ouname',
  'ou',
];

export function getProgressPercentage(numerator: number, denominator: number) {
  const percentageValue = ((numerator / denominator) * 100).toFixed(0);
  return parseInt(percentageValue, 10);
}

export function getSanitizedDisplayValue(sanitizedValue: string, displayValues) {
  const valueObject = _.find(displayValues || [], (displayValue: any) => {
    return _.isEqual(
      displayValue.value.toLowerCase(),
      sanitizedValue.toLowerCase()
    );
  });
  const sanitizedDisplayName = valueObject
    ? valueObject.displayName
    : sanitizedValue;
  return sanitizedDisplayName;
}

export function getSanitizesReportValue(
  value: any,
  codes: Array<string>,
  isBoolean: boolean,
  isDate: boolean,
  displayValues: Array<any>
) {
  const displayNames = _.flattenDeep(
    _.map(displayValues || [], (displayValue) => displayValue.displayName)
  );
  displayNames.push('Yes', '1');

  let sanitizedValue = '';
  if (codes && codes.length > 0) {
    sanitizedValue =
      codes.includes(value) || displayNames.includes(value)
        ? 'Yes'
        : sanitizedValue;
  } else if (isBoolean) {
    sanitizedValue = displayNames.includes(`${value}`) ? 'Yes' : sanitizedValue;
  } else if (isDate) {
    sanitizedValue = getFormattedDate(value);
  } else {
    sanitizedValue = value;
  }

  return displayValues && displayValues.length > 0
    ? getSanitizedDisplayValue(sanitizedValue, displayValues)
    : sanitizedValue;

  // return sanitizedValue;
}

export function getSanitizedAnalyticData(Analytics: any, programStage: string) {
  const { headers, rows, metaData } = Analytics;
  const dimensions = metaData && metaData.dimensions ? metaData.dimensions : {};
  const defaultKeys = _.flattenDeep(
    _.concat(
      defaultAnalyticKeys,
      _.keys(_.omit(dimensions, _.concat(['ou', 'pe'], dimensions.ou || [])))
    )
  );
  return _.flattenDeep(
    _.map(rows, (rowData: any) => {
      const dataObject = { programStage: programStage };
      for (const key of defaultKeys) {
        const keyIndex = _.findIndex(
          headers || [],
          (header: any) => header && header.name === key
        );
        dataObject[key] = rowData[keyIndex] || '';
      }
      return dataObject;
    })
  );
}
