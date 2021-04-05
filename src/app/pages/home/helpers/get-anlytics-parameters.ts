import { DATA_CONFIG } from './get-chart-data-config';
import * as _ from 'lodash';

export function getAnlyticsParameters(
  selectedOrgUnitItems: any,
  selectedPeriods: any
) {
  const pe = _.uniq(
    _.flattenDeep(_.map(selectedPeriods, (period: any) => period.id || []))
  );
  const dx = _.uniq(
    _.flattenDeep(
      _.map(DATA_CONFIG, (dataConfig: any) => {
        return _.map(
          dataConfig.series || [],
          (seriesConfig: any) => seriesConfig.id || []
        );
      })
    )
  );
  const ou = _.uniq(
    _.flattenDeep(
      _.map(
        selectedOrgUnitItems,
        (organistionUnit: any) => organistionUnit.id || []
      )
    )
  );
  return { dx, pe, ou };
}
