import * as _ from 'lodash';

export function getAnalyticsParameters(
  selectedOrgUnitItems: Array<any>,
  selectedPeriods: Array<any>,
  selectedProgramIds: Array<string>,
  dxConfigs: Array<{ id: string; name: string; programStage: string }>
) {
  const enrollmentAnalyticParameters = [];
  const pe = _.uniq(
    _.flattenDeep(_.map(selectedPeriods, (period: any) => period.id || []))
  );
  const ou = _.uniq(
    _.flattenDeep(
      _.map(
        selectedOrgUnitItems,
        (organisationUnit: any) => organisationUnit.id || []
      )
    )
  );
  const attributes = _.filter(
    dxConfigs || [],
    (dxConfig: any) => dxConfig.isAttribute
  );
  const dataElements = _.filter(
    dxConfigs || [],
    (dxConfig: any) => !dxConfig.isAttribute
  );

  if (selectedProgramIds.length > 0 && attributes.length > 0) {
    enrollmentAnalyticParameters.push(
      _.map(selectedProgramIds || [], (selectedProgramId: string) => {
        return {
          ou,
          pe,
          programId: selectedProgramId,
          isEnrollmentAnalytic: true,
          dx: _.uniq(
            _.flattenDeep(
              _.map(
                attributes || [],
                (attributeObject: any) => attributeObject.id || []
              )
            )
          ),
        };
      })
    );
  }

  const groupedDataElements = _.groupBy(dataElements || [], 'programStage');
  const groupedDxConfigs = _.mapValues(
    groupedDataElements,
    (programStageDataElements: any[]) => {
      const programStage =
        programStageDataElements.length > 0
          ? programStageDataElements[0].programStage
          : '';
      const programId =
        programStageDataElements.length > 0
          ? programStageDataElements[0].program || ''
          : '';
      const configs =
        programId && programId !== ''
          ? [...programStageDataElements]
          : [
              ...programStageDataElements,
              ..._.map(attributes, (attribute: any) => ({
                ...attribute,
                programStage,
                program: programId,
              })),
            ];
      return configs;
    }
  );
  return _.keys(groupedDxConfigs).length > 0
    ? _.flattenDeep(
        _.concat(
          enrollmentAnalyticParameters,
          _.map(_.keys(groupedDxConfigs), (programStage: String) => {
            const dx = _.uniq(
              _.flattenDeep(
                _.map(
                  groupedDxConfigs[programStage] || [],
                  (groupedDxConfig: any) =>
                    groupedDxConfig.id !== '' &&
                    groupedDxConfig.programStage !== ''
                      ? `${groupedDxConfig.programStage}.${groupedDxConfig.id}`
                      : []
                )
              )
            );
            if (dx.length > 0) {
              const programIds = _.uniq(
                _.flattenDeep(
                  _.map(
                    groupedDxConfigs[programStage] || [],
                    (groupedDxConfig: any) => {
                      return groupedDxConfig.program &&
                        groupedDxConfig.program !== ''
                        ? groupedDxConfig.program
                        : [];
                    }
                  )
                )
              );
              const programId = programIds.length > 0 ? programIds[0] : '';
              return {
                ou,
                pe,
                dx,
                programId,
                isEnrollmentAnalytic: false,
              };
            } else {
              return [];
            }
          })
        )
      )
    : _.flattenDeep([enrollmentAnalyticParameters]);
}
