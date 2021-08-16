import * as _ from 'lodash';

export function getAnalyticsParameters(
  selectedOrgUnitItems: Array<any>,
  selectedPeriods: Array<any>,
  selectedProgramIds: Array<string>,
  dxConfigs: Array<{ id: string; name: string; programStage: string }>
) {
  //@TODO getting attributes & stages per programs selected
  const enrollmentAnalyticParameters = [];
  const pe = _.uniq(
    _.flattenDeep(
      _.map(selectedPeriods, (period: any) => {
        const { id, type, endDate, startDate } = period;
        return startDate &&
          endDate &&
          startDate.id &&
          endDate.id &&
          type &&
          `${type}`.toLowerCase() == 'dates-range'
          ? `startDate=${startDate.id}&endDate=${endDate.id}`
          : id || [];
      })
    )
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
    (dxConfig: any) => dxConfig.isAttribute && dxConfig.id && dxConfig.id !== ''
  );
  const dataElements = _.filter(
    dxConfigs || [],
    (dxConfig: any) => !dxConfig.isAttribute
  );

  //@TODO filtering attributes per program
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

  //@TODO filtering attributes per stages
  //@TODO filtering stages data
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
      // @TODO getting attributes per program
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
