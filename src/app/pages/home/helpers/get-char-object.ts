import * as _ from 'lodash';
import { DEFAULT_CHART_OBJECT, DATA_CONFIG } from './get-chart-data-config';

export function getChartObject(analytics: any) {
  const valueIndex = getIndexFromHeadersMetadata(
    analytics.headers || [],
    'value'
  );
  const dxIndex = getIndexFromHeadersMetadata(analytics.headers || [], 'dx');

  const rows = analytics.rows || [];
  let chartObject = DEFAULT_CHART_OBJECT;
  const categories = _.map(DATA_CONFIG, (config: any) => config.name);
  let count = -1;
  const series = _.flattenDeep(
    _.map(DATA_CONFIG, (config: any) => {
      count++;
      return _.map(config.series || [], (seriesConfig: any) => {
        const value = getRowValue(
          rows,
          dxIndex,
          valueIndex,
          seriesConfig.id || ''
        );
        const data = _.map(_.range(count), () => '');
        return {
          name: seriesConfig.name || '',
          color: seriesConfig.color || '',
          data: _.flattenDeep(_.concat(data, value)),
        };
      });
    })
  );
  return {
    ...chartObject,
    xAxis: { ...chartObject.xAxis, categories },
    series,
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: true,
    },
  };
}

function getRowValue(
  rows: any,
  dxIndex: number,
  valueIndex: number,
  id: string
) {
  const selectedRow = _.filter(rows, (row: any) => {
    return row && row[dxIndex] && row[dxIndex] === id;
  });
  let value = 0;
  if (id !== '' && selectedRow.length > 0) {
    for (const data of selectedRow) {
      value += parseInt(data[valueIndex] || 0, 10);
    }
  }
  return value;
}

function getIndexFromHeadersMetadata(headers: any, value: string) {
  return _.findIndex(
    headers,
    (header: any) => header && header.name && header.name === value
  );
}
