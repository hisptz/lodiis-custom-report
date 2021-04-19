import * as _ from 'lodash';

export function getAnalyticsParameters(
  selectedOrgUnitItems: Array<any>,
  selectedPeriods: Array<any>,
  dxConfigs: Array<{ id: string; name: string; programStage: string }>
) {
  const pe = _.uniq(
    _.flattenDeep(_.map(selectedPeriods, (period: any) => period.id || []))
  );

  const attributes = _.filter(
    dxConfigs || [],
    (dxConfig: any) => dxConfig.isAttribute
  );

  const dataElements = _.filter(
    dxConfigs || [],
    (dxConfig: any) => !dxConfig.isAttribute
  );

  const groupedDataElements = _.groupBy(dataElements || [], 'programStage');
  const groupedDxConfigs = _.mapValues(
    groupedDataElements,
    (programStageDataElements: any[]) => {
      const programStage =
        programStageDataElements.length > 0
          ? programStageDataElements[0].programStage
          : '';
      const configs = [
        ...programStageDataElements,
        ..._.map(attributes, (attribute: any) => ({
          ...attribute,
          programStage,
        })),
      ];
      return configs;
    }
  );
  const ou = _.uniq(
    _.flattenDeep(
      _.map(
        selectedOrgUnitItems,
        (organisationUnit: any) => organisationUnit.id || []
      )
    )
  );
  return _.keys(groupedDxConfigs).length > 0
    ? _.flattenDeep(
        _.map(_.keys(groupedDxConfigs), (programStage: String) => {
          const dx = _.uniq(
            _.flattenDeep(
              _.map(
                groupedDxConfigs[programStage] || [],
                (groupedDxConfig: {
                  id: string;
                  name: string;
                  programStage: string;
                }) =>
                  groupedDxConfig.id !== '' &&
                  groupedDxConfig.programStage !== ''
                    ? `${groupedDxConfig.programStage}.${groupedDxConfig.id}`
                    : []
              )
            )
          );
          if (dx.length > 0) {
            return { ou, pe, dx };
          } else {
            return [];
          }
        })
      )
    : [];
}
