import * as _ from 'lodash';
import { types } from 'util';
import {
  getSanitizesReportValue,
  getSanitizedDisplayValue,
} from './report-data.helper';

const districtLevel = 2;
const commmunityCouncilLevel = 3;
const facilityLevel = 4;

const noneAgywParticipationProgramStages = ['uctHRP6BBXP'];

export function getFormattedEventAnalyticDataForReport(
  analyticData: Array<any>,
  reportConfig: any,
  locations: any
) {
  const groupedAnalyticDataByBeneficiary = _.groupBy(analyticData, 'tei');
  return _.flattenDeep(
    _.map(_.keys(groupedAnalyticDataByBeneficiary), (tei: string) => {
      const analyticDataByBeneficiary = groupedAnalyticDataByBeneficiary[tei];
      const isNotAgywBeneficiary =
        _.filter(
          _.uniq(
            _.flatMapDeep(
              _.map(
                analyticDataByBeneficiary,
                (data: any) => data.programStage || []
              )
            )
          ),
          (stage: string) => noneAgywParticipationProgramStages.includes(stage)
        ).length > 0;
      const beneficiaryData = {};
      for (const dxConfigs of reportConfig.dxConfigs || []) {
        const {
          id,
          name,
          programStage,
          isBoolean,
          isOrganisationUnit,
          codes,
          isDate,
          displayValues,
        } = dxConfigs;
        let value = '';
        //@TODO manipulate dob attributes to qZP982qpSPS
        // beneficiary_age
        //beneficiary_age_range
        //beneficiary_age_ranges
        //@TODO using programs to deduce types => ["em38qztTI8s", "BNsDaCclOiu"]
        //beneficiary_type

        //checking for organisation units fielfs
        //wv3YAGLZlev
        if (id === 'is_service_provided') {
          const lastService = getLastServiceFromAnalyticData(
            analyticDataByBeneficiary,
            programStage
          );
          value =
            lastService && _.keys(lastService).length > 0
              ? 'Yes'
              : value === ''
              ? ''
              : 'No';
        }
        if (id === 'last_service_community_council') {
          const lastService = getLastServiceFromAnalyticData(
            analyticDataByBeneficiary,
            programStage
          );
          const locationId =
            lastService && _.keys(lastService).length > 0
              ? lastService['ou'] || ''
              : '';
          value = getLocationNameById(
            locations,
            commmunityCouncilLevel,
            locationId
          );
        } else if (id === 'facility_name') {
          value = getLocationNameByLevel(
            analyticDataByBeneficiary,
            locations,
            facilityLevel
          );
        } else if (id === 'district_of_service') {
          value = getLocationNameByLevel(
            analyticDataByBeneficiary,
            locations,
            districtLevel
          );
        } else if (id === 'date_of_last_service_received') {
          const lastService = getLastServiceFromAnalyticData(
            analyticDataByBeneficiary,
            programStage
          );
          value =
            lastService && _.keys(lastService).length > 0
              ? lastService['eventdate'] || value
              : value;
        } else if (id === 'isAgywBeneficiary') {
          value = !isNotAgywBeneficiary ? 'Yes' : 'No';
        } else {
          const eventReportData =
            id !== '' && programStage === ''
              ? _.find(analyticDataByBeneficiary, (data: any) => {
                  return _.keys(data).includes(id);
                })
              : _.find(analyticDataByBeneficiary, (data: any) => {
                  return (
                    _.keys(data).includes(id) &&
                    data.programStage &&
                    data.programStage === programStage
                  );
                });
          value = eventReportData ? eventReportData[id] : value;
        }
        if (
          _.keys(beneficiaryData).includes(name) &&
          beneficiaryData[name] !== ''
        ) {
          value = beneficiaryData[name];
        }
        beneficiaryData[name] =
          value !== ''
            ? getSanitizesReportValue(
                value,
                codes,
                isBoolean,
                isDate,
                displayValues,
                isNotAgywBeneficiary
              )
            : getSanitizedDisplayValue(
                value,
                displayValues,
                isNotAgywBeneficiary
              );
      }
      return beneficiaryData;
    })
  );
}

function getLastServiceFromAnalyticData(
  analyticDataByBeneficiary: Array<any>,
  programStage: string
) {
  let lastService = {};
  const sortedServices = _.reverse(
    _.sortBy(
      _.filter(
        programStage && programStage !== ''
          ? _.filter(
              analyticDataByBeneficiary,
              (data: any) =>
                data.programStage && data.programStage === programStage
            )
          : analyticDataByBeneficiary,
        (data: any) => data && data.hasOwnProperty('eventdate')
      ),
      ['eventdate']
    )
  );
  if (sortedServices.length > 0) {
    lastService = { ...lastService, ...sortedServices[0] };
  }
  return lastService;
}

function getLocationNameByLevel(
  analyticDataByBeneficiary: Array<any>,
  locations: Array<any>,
  level: any
) {
  const ouIds = _.uniq(
    _.flattenDeep(_.map(analyticDataByBeneficiary, (data) => data.ou || []))
  );
  const locationId = ouIds.length > 0 ? ouIds[0] : '';
  return getLocationNameById(locations, level, locationId);
}

function getLocationNameById(
  locations: Array<any>,
  level: number,
  locationId: string
) {
  let locationName = '';
  const locationObj = _.find(
    locations,
    (data: any) => data && data.id && data.id === locationId
  );
  if (locationObj && locationObj.ancestors) {
    const location = _.find(
      locationObj.ancestors || [],
      (data: any) => data && data.level === level
    );
    locationName = location ? location.name || locationName : locationName;
  }
  return locationName;
}
