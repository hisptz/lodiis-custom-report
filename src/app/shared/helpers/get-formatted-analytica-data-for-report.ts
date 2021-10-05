import * as _ from 'lodash';
import {
  getSanitizesReportValue,
  getSanitizedDisplayValue,
} from './report-data.helper';

const districtLevel = 2;
const commmunityCouncilLevel = 3;
const facilityLevel = 4;

const noneAgywParticipationProgramStages = ['uctHRP6BBXP'];
const beneficiaryDateOfBirthReference = 'qZP982qpSPS';

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

function getBeneficiaryAge(dob: string) {
  var ageDifMs = Date.now() - new Date(dob).getTime();
  var ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function getValueFromAnalyticalData(
  analyticData: Array<any>,
  id: string,
  programStage: string
) {
  let value = '';
  for (const data of _.filter(
    analyticData || [],
    (dataObjet: any) =>
      dataObjet.programStage &&
      (dataObjet.programStage === programStage || programStage === '')
  )) {
    value = data.hasOwnProperty(id) && `${data[id]}` !== '' ? data[id] : value;
  }
  return value;
}

function getBeneficiaryAgeRanges(age: number) {
  let value =
    age < 1
      ? ''
      : age >= 1 && age < 5
      ? '1-4'
      : age < 10
      ? '5-9'
      : age < 15
      ? '10-14'
      : age < 18
      ? '15-17'
      : age < 21
      ? '18-20'
      : '20+';
  return value;
}

function getBeneficiaryAgeRange(age: number): string {
  return age < 18 ? '0-17' : '18+';
}

function getBeneficiaryHivRiskAssessmentResult(
  ids: any,
  analyticDataByBeneficiary: any
) {
  let riskValue = 'Low risk';
  for (const referenceId of ids || []) {
    const referenceValue = getValueFromAnalyticalData(
      analyticDataByBeneficiary,
      beneficiaryDateOfBirthReference,
      referenceId
    );
    if (
      `${referenceValue}`.toLocaleLowerCase() === 'yes' ||
      `${referenceValue}`.toLocaleLowerCase() === 'true'
    ) {
      riskValue = 'High risk';
    }
  }
  return riskValue;
}

export function getFormattedEventAnalyticDataForReport(
  analyticData: Array<any>,
  reportConfig: any,
  locations: any,
  programToProgramStageObject: any
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
          ids,
          name,
          programStage,
          isBoolean,
          isOrganisationUnit,
          codes,
          isDate,
          displayValues,
        } = dxConfigs;
        let value = '';
        if (isOrganisationUnit) {
          // console.log({
          //   id,
          //   analyticDataByBeneficiary,
          //   lo: 'wv3YAGLZlev',
          //   locations,
          // });
        } else if (id === 'hiv_risk_assessment_result') {
          value = getBeneficiaryHivRiskAssessmentResult(
            ids,
            analyticDataByBeneficiary
          );
        } else if (id === 'beneficiary_age') {
          const dob = getValueFromAnalyticalData(
            analyticDataByBeneficiary,
            beneficiaryDateOfBirthReference,
            programStage
          );
          if (dob !== '') {
            const age = getBeneficiaryAge(dob);
            value = `${age}`;
          }
        } else if (id === 'beneficiary_age_range') {
          const dob = getValueFromAnalyticalData(
            analyticDataByBeneficiary,
            beneficiaryDateOfBirthReference,
            programStage
          );
          if (dob !== '') {
            const age = getBeneficiaryAge(dob);
            value = getBeneficiaryAgeRange(age);
          }
        } else if (id === 'beneficiary_age_ranges') {
          const dob = getValueFromAnalyticalData(
            analyticDataByBeneficiary,
            beneficiaryDateOfBirthReference,
            programStage
          );
          if (dob !== '') {
            const age = getBeneficiaryAge(dob);
            value = getBeneficiaryAgeRanges(age);
          }
        } else if (id === 'beneficiary_type') {
          const eventProgramStages = _.uniq(
            _.flattenDeep(
              _.map(analyticDataByBeneficiary || [], (data) =>
                data && data.hasOwnProperty('programStage')
                  ? data.programStage
                  : []
              )
            )
          );
          let beneficiaryProgrmId = '';
          if (eventProgramStages.length > 0) {
            const stageId = eventProgramStages[0];
            for (const programId in _.keys(eventProgramStages)) {
              if (eventProgramStages[programId].includes(stageId)) {
                beneficiaryProgrmId = programId;
              }
            }
          }

          // em38qztTI8s == OVC
          // BNsDaCclOiu == caregiver
          // hOEIHJDrrvz = AGYW/Dreams
          //console.log({ id, analyticDataByBeneficiary });
          console.log({
            programToProgramStageObject,
            eventProgramStages,
            beneficiaryProgrmId,
          });
        } else if (id === 'is_service_provided') {
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
