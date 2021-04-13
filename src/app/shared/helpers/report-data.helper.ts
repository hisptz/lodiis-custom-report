import * as _ from 'lodash';

const defaultAnalyticKeys = ['eventdate', 'enrollmentdate', 'tei', 'ouname', 'ou'];

export function getProgressPercentage(numerator: number, denominator: number) {
    const percentageValue = ((numerator / denominator) * 100).toFixed(0);
    return parseInt(percentageValue, 10);
  }


export function getSanitizesReportValue(
    value: any,
    code: Array<string>,
    isBoolean: boolean,
    isDate: boolean
  ) {
    let sanitizedValue = '';
    if (code && code.length > 0) {
      sanitizedValue = code.includes(value) || value == "Yes" ? 'Yes' : sanitizedValue;
    } else if (isBoolean) {
      sanitizedValue = `${value}` === '1' ||  value == "Yes" ? 'Yes' : sanitizedValue;
    } else if (isDate) {
      sanitizedValue = getFormattedDate(value);
    } else {
      sanitizedValue = value;
    }
    return sanitizedValue;
  }

 export function  getFormattedDate(date: any) {
    let dateObject = new Date(date);
    if (isNaN(dateObject.getDate())) {
      dateObject = new Date();
    }
    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1;
    const year = dateObject.getFullYear();
    return (
      year +
      (month > 9 ? `-${month}` : `-0${month}`) +
      (day > 9 ? `-${day}` : `-0${day}`)
    );
  }


  export function getSanitizedAnalyticData(anlytics: any, programStage: string) {
    const { headers, rows, metaData } = anlytics;
    const dimensions =
      metaData && metaData.dimensions ? metaData.dimensions : {};
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