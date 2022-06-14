import * as _ from 'lodash';
import {
  getSanitizesReportValue,
  getSanitizedDisplayValue,
} from './report-data.helper';

const districtLevel = 2;
const communityCouncilLevel = 3;
const facilityLevel = 4;

const noneAgywParticipationProgramStages = ['uctHRP6BBXP'];
const beneficiaryDateOfBirthReference = ['qZP982qpSPS', 'jVSwC6Ln95H'];
const primaryChildCheckReference = 'KO5NC4pfBmv';
const casePlanProgramStages = ['gkNKXUxpyv9', 'vjF07cZNST3'];

function getAssessmentDate(analyticDataByBeneficiary: Array<any>) {
  let date = '';
  for (const programStage of casePlanProgramStages) {
    const serviceData = getLastServiceFromAnalyticData(
      analyticDataByBeneficiary,
      programStage
    );
    if (_.keys(serviceData).length > 0) {
      date =
        serviceData && _.keys(serviceData).length > 0
          ? serviceData['eventdate'] || date
          : date;
    }
  }
  return date;
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

function getLongFormPrEPValue(
  analyticsDataByBeneficiary: Array<any>,
  prepFields: Array<string>,
  programStage: string
): string {
  const programStageData = _.find(
    analyticsDataByBeneficiary || [],
    (data: any) => {
      return data.programStage && data.programStage === programStage;
    }
  );

  if (programStageData) {
    for (const field of prepFields) {
      if (
        !programStageData.hasOwnProperty(field) ||
        programStageData[field] !== '1'
      ) {
        return '0';
      }
    }
  } else {
    return '0';
  }
  return '1';
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
  return getLocationNameByIdAndLevel(locations, level, locationId);
}

function getLocationNameByIdAndLevel(
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
  ids: string[],
  programStage: string
) {
  let value = '';
  for (const data of _.filter(
    analyticData || [],
    (dataObjet: any) =>
      dataObjet.programStage &&
      (dataObjet.programStage === programStage || programStage === '')
  )) {
    for (const id of ids) {
      value =
        data.hasOwnProperty(id) && `${data[id]}` !== '' ? data[id] : value;
    }
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
  let riskValue = '';
  for (const referenceId of ids || []) {
    const referenceValue = getValueFromAnalyticalData(
      analyticDataByBeneficiary,
      beneficiaryDateOfBirthReference,
      referenceId
    );
    if (
      `${referenceValue}`.toLocaleLowerCase() === 'yes' ||
      `${referenceValue}`.toLocaleLowerCase() === '1' ||
      `${referenceValue}`.toLocaleLowerCase() === 'true'
    ) {
      riskValue = 'High risk';
    } else {
      riskValue =
        riskValue === 'High risk' || riskValue === '' ? riskValue : 'Low risk';
    }
  }
  return riskValue;
}

function getBeneficiaryTypeValue(
  analyticDataByBeneficiary: any,
  programToProgramStageObject: any
) {
  let beneficiaryType = '';
  const eventProgramStages = _.uniq(
    _.flattenDeep(
      _.map(analyticDataByBeneficiary || [], (data: any) =>
        data && data.hasOwnProperty('programStage') ? data.programStage : []
      )
    )
  );

  let beneficiaryProgramId = '';
  if (eventProgramStages.length > 0) {
    const stageId = eventProgramStages[0];
    for (const programId of _.keys(programToProgramStageObject)) {
      if (programToProgramStageObject[programId].includes(stageId)) {
        beneficiaryProgramId = programId;
      }
    }
  }

  if (beneficiaryProgramId === 'BNsDaCclOiu') {
    beneficiaryType = 'Caregiver';
  } else if (beneficiaryProgramId === 'em38qztTI8s') {
    const isPrimaryChild = getValueFromAnalyticalData(
      analyticDataByBeneficiary,
      [primaryChildCheckReference],
      ''
    );
    beneficiaryType =
      `${isPrimaryChild}`.toLowerCase() === 'true' ||
      `${isPrimaryChild}`.toLowerCase() === '1'
        ? 'Primary Child'
        : 'Child';
  }
  return beneficiaryType;
}

export function getFormattedEventAnalyticDataForReport(
  analyticData: Array<any>,
  reportConfig: any,
  locations: any,
  programToProgramStageObject: any
) {
  const groupedAnalyticDataByBeneficiary = _.groupBy(analyticData, 'tei');
  return _.map(
    _.flattenDeep(
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
            (stage: string) =>
              noneAgywParticipationProgramStages.includes(stage)
          ).length > 0;
        const beneficiaryData = {};
        for (const dxConfigs of reportConfig.dxConfigs || []) {
          const {
            id,
            ids,
            name,
            programStage,
            isBoolean,
            codes,
            isDate,
            displayValues,
          } = dxConfigs;
          let value = '';
          if (id === 'assessmment_date') {
            const assessmentDate = getAssessmentDate(analyticDataByBeneficiary);
            value = `${assessmentDate}`.split(' ')[0];
          } else if (id === 'is_assemmenet_conducted') {
            const assessmentDate = getAssessmentDate(analyticDataByBeneficiary);
            value = assessmentDate === '' ? 'No' : 'Yes';
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
            value = getBeneficiaryTypeValue(
              analyticDataByBeneficiary,
              programToProgramStageObject
            );
          } else if (id === 'prep_from_long_form') {
            value = getLongFormPrEPValue(
              analyticDataByBeneficiary,
              ids,
              programStage
            );
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
            value = getLocationNameByIdAndLevel(
              locations,
              communityCouncilLevel,
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
            // Take consideration of services codes
            const eventReportData =
              id !== '' && programStage === ''
                ? _.find(analyticDataByBeneficiary, (data: any) => {
                    return codes && codes.length > 0
                      ? _.keys(data).includes(id) && codes.includes(data[id])
                      : _.keys(data).includes(id);
                  })
                : _.find(analyticDataByBeneficiary, (data: any) => {
                    return codes && codes.length > 0
                      ? _.keys(data).includes(id) &&
                          codes.includes(data[id]) &&
                          data.programStage &&
                          data.programStage === programStage
                      : _.keys(data).includes(id) &&
                          data.programStage &&
                          data.programStage === programStage;
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
    ),
    (beneficary: any) => {
      const serviceProvider = beneficary['Service Provider'] || '';
      if (serviceProvider === 'scriptrunner') {
        beneficary['Implementing Mechanism Name'] = 'UPLOADED';
        beneficary['Service Provider'] = 'UPLOADED';
      }
      return beneficary;
    }
  );
}
