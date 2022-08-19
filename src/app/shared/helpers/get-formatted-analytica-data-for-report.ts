import * as _ from 'lodash';
import { getFormattedDate } from 'src/app/core/utils/date-formatter.util';
import {
  getSanitizesReportValue,
  getSanitizedDisplayValue,
} from './report-data.helper';

const districtLevel = 2;
const communityCouncilLevel = 3;
const facilityLevel = 4;

const noneAgywParticipationProgramStages = ['uctHRP6BBXP'];
const noneAgywDreamBeneficairiesStage = ['Yn6AJ0CAxb2'];
const prepVisitProgramStages = ['nVCqxOg0nMQ', 'Yn6AJ0CAxb2'];
const beneficiaryDateOfBirthReference = ['qZP982qpSPS', 'jVSwC6Ln95H'];
const primaryChildCheckReference = 'KO5NC4pfBmv';
const casePlanProgramStages = ['gkNKXUxpyv9', 'vjF07cZNST3'];
export const defaultPrepVisitKey = 'Follow up Visit';
const interventionsConstant = {
  hiv_prevention: 'HIV Prevention Education',
  flatten_toun: 'AFLATEEN/TOUN',
  financial_education: 'FinancialLiteracyEducation',
  hiv_riskAssessment: 'HIV Risk Assessment',
  violence_education: 'ViolencePreventionEducation',
  go_girls: 'Go Girls',
  condom_education: 'CondomEducationProvision',
  saving_group: 'SAVING GROUPS',
  silc: 'SILC',
};

export function getSanitizedPrepCustomReport(eventReportAnalyticData: any) {}

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

function getReferralValue(
  analyticsDataByBeneficiary: Array<any>,
  prepFields: Array<string>,
  programStage: string,
  codes
): string {
  const programStageData = _.find(
    analyticsDataByBeneficiary || [],
    (data: any) => {
      return data.programStage && data.programStage === programStage;
    }
  );
  if (programStageData) {
    if (
      prepFields.some((field) => {
        return (
          programStageData[field] !== '1' &&
          prepFields.some((fieldWithCode) => {
            return !codes.includes(programStageData[fieldWithCode]);
          })
        );
      })
    ) {
      return 'No';
    } else {
      return 'Yes';
    }
  } else {
    return 'No';
  }
}

function _isBenediciaryScreenedForPrep(
  ids: string[],
  analyticDataByBeneficiary: any
) {
  var isScreenedForPrep = false;
  for (var beneficairyData of analyticDataByBeneficiary) {
    for (const id of ids) {
      if (_.keys(beneficairyData).includes(id)) {
        const value = beneficairyData[id] ?? '';
        if (`${value}`.trim() !== '') {
          isScreenedForPrep = true;
        }
      }
    }
  }
  return isScreenedForPrep;
}

function getFollowingUpVisits(analyticDataByBeneficiary: any) {
  const followingUpVisits = {};
  const visitDates = _.reverse(
    _.map(
      _.sortBy(
        _.filter(analyticDataByBeneficiary, (beneficiaryData: any) => {
          const programStageId = beneficiaryData['programStage'] || '';
          return prepVisitProgramStages.includes(programStageId);
        }),
        ['eventdate']
      ),
      (beneficiaryData: any) => getFormattedDate(beneficiaryData['eventdate'])
    )
  );
  let visitIndex = 0;
  for (const visitDate of visitDates) {
    visitIndex++;
    const key = `${defaultPrepVisitKey} ${visitIndex}`;
    followingUpVisits[key] = visitDate;
  }
  return followingUpVisits;
}

function isBeneficiaryEligibleForPrep(
  ids: any,
  analyticDataByBeneficiary: any
) {
  const dataObj = {};
  for (const id of ids) {
    dataObj[id] = '1';
  }
  for (const beneficairyData of analyticDataByBeneficiary) {
    for (const id of ids) {
      const value = beneficairyData[id] ?? '';
      if (!['Yes', 'true', '1'].includes(`${value}`)) {
        dataObj[id] = '0';
      }
    }
  }
  return _.uniq(_.values(dataObj)).includes('0') ? 'No' : 'Yes';
}

function getPrepBeneficiaryStatus(analyticDataByBeneficiary: any) {
  const prepVisits = _.filter(analyticDataByBeneficiary, (data: any) => {
    const programStageId = data['programStage'];
    return prepVisitProgramStages.includes(programStageId);
  });
  return prepVisits.length == 1
    ? 'PrEP New'
    : prepVisits.length > 1
    ? 'PrEP Continue'
    : '';
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
function getBeneficiaryCustomAgeRanges(age: number) {
  let value =
    age < 15 && age >= 10
      ? '10-14'
      : age < 20 && age >= 15
      ? '15-19'
      : age < 25 && age >= 20
      ? '20-24'
      : '';
  return value;
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
  const groupedAnalyticDataByBeneficiary = _.groupBy(
    _.uniqBy(analyticData, 'psi'),
    'tei'
  );
  const serviceCount: number = _.keys(groupedAnalyticDataByBeneficiary).length;
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
              noneAgywParticipationProgramStages.includes(stage) ||
              noneAgywDreamBeneficairiesStage.includes(stage)
          ).length > 0;
        let beneficiaryData = {};
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
          if (id === 'district_of_residence') {
            const ouIds = _.uniq(
              _.flattenDeep(
                _.map(analyticDataByBeneficiary, (dataObj) =>
                  _.keys(dataObj).length > 0 ? dataObj['ou'] || '' : ''
                )
              )
            );
            value = getLocationNameByIdAndLevel(
              locations,
              districtLevel,
              ouIds.length > 0 ? ouIds[0] : value
            );
          } else if (id === 'community_council_of_residence') {
            const ouIds = _.uniq(
              _.flattenDeep(
                _.map(analyticDataByBeneficiary, (dataObj) =>
                  _.keys(dataObj).length > 0 ? dataObj['ou'] || '' : ''
                )
              )
            );
            value = getLocationNameByIdAndLevel(
              locations,
              communityCouncilLevel,
              ouIds.length > 0 ? ouIds[0] : value
            );
          } else if (id === 'is_eligible_for_prep') {
            value = isBeneficiaryEligibleForPrep(
              ids,
              analyticDataByBeneficiary
            );
          } else if (id === 'is_screened_for_prep') {
            var isScreenedForPrep = _isBenediciaryScreenedForPrep(
              ids,
              analyticDataByBeneficiary
            );
            value = isScreenedForPrep ? 'Yes' : 'No';
          } else if (id === 'prep_beneficairy_status') {
            value = getPrepBeneficiaryStatus(analyticDataByBeneficiary);
          } else if (id === 'assessmment_date') {
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
          } else if (id === 'referral_facility_id') {
            value = getReferralValue(
              analyticDataByBeneficiary,
              ids,
              programStage,
              codes
            );
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
                : programStage === ''
                ? _.find(analyticDataByBeneficiary, (data: any) => {
                    return codes && codes.length > 0
                      ? _.keys(data).includes(id) &&
                          codes.includes(data[id]) &&
                          data.programStage &&
                          data.programStage === programStage
                      : _.keys(data).includes(id) &&
                          data.programStage &&
                          data.programStage === programStage;
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

          if (id === 'following_up_visit') {
            const followingUpVisits = getFollowingUpVisits(
              analyticDataByBeneficiary
            );
            beneficiaryData = { ...beneficiaryData, ...followingUpVisits };
          } else {
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
                    isNotAgywBeneficiary,
                    ids
                  )
                : getSanitizedDisplayValue(
                    value,
                    displayValues,
                    isNotAgywBeneficiary
                  );
          }
        }
        const modifyBeneficiaryData = _.assign(beneficiaryData, {
          ['Total Services']: serviceCount,
        });
        const sanitizedBeneficiaryData = computeCompletedPackage(
          modifyBeneficiaryData,
          tei,
          analyticData
        );
        return sanitizedBeneficiaryData;
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

export function computeCompletedPackage(beneficiaryData, tei, analyticData) {
  const sanitizedAnalyticData =
    _.filter(analyticData, function (analyticObject) {
      return analyticObject?.tei === tei;
    }) ?? [];

  const groupedAnalyticDataByIntervention = _.groupBy(
    _.uniqBy(sanitizedAnalyticData, 'psi'),
    'Eug4BXDFLym'
  );
  const groupedAnalyticDataByBeneficiary: any = _.groupBy(
    _.uniqBy(analyticData, 'psi'),
    'tei'
  );
  const analyticDataByBeneficiary = groupedAnalyticDataByBeneficiary[tei];
  //check age band
  const age: number = parseInt(beneficiaryData?.Age ?? '0');
  let sanitizedBeneficiaryData = {};
  const ageBand: string = getBeneficiaryCustomAgeRanges(age);
  switch (ageBand) {
    case '10-14':
      // evaluate service variables
      if (
        (_.keys(groupedAnalyticDataByIntervention) ?? []).includes(
          interventionsConstant.hiv_prevention
        ) &&
        evaluateSessionNumberPerIntervention(
          groupedAnalyticDataByIntervention[
            interventionsConstant.hiv_prevention
          ] ?? [],
          '>=',
          9
        ) &&
        (_.keys(groupedAnalyticDataByIntervention) ?? []).includes(
          interventionsConstant.violence_education
        ) &&
        evaluateSessionNumberPerIntervention(
          groupedAnalyticDataByIntervention[
            interventionsConstant.violence_education
          ] ?? [],
          '>=',
          1
        ) &&
        (_.keys(groupedAnalyticDataByIntervention) ?? []).includes(
          interventionsConstant.flatten_toun
        ) &&
        evaluateSessionNumberPerIntervention(
          groupedAnalyticDataByIntervention[
            interventionsConstant.flatten_toun
          ] ?? [],
          '>=',
          9
        ) &&
        (_.keys(groupedAnalyticDataByIntervention) ?? []).includes(
          interventionsConstant.financial_education
        ) &&
        evaluateSessionNumberPerIntervention(
          groupedAnalyticDataByIntervention[
            interventionsConstant.financial_education
          ] ?? [],
          '==',
          4
        ) &&
        beneficiaryData[interventionsConstant.hiv_riskAssessment] === 'Yes'
      ) {
        sanitizedBeneficiaryData = _.assign(beneficiaryData, {
          ['Total Completed Primary Package']: 'Yes',
        });
        computeSecondaryCompletedPackage(
          ageBand,
          sanitizedBeneficiaryData,
          groupedAnalyticDataByIntervention,
          analyticDataByBeneficiary
        );
      } else {
        sanitizedBeneficiaryData = _.assign(beneficiaryData, {
          ['Total Completed Primary Package']: 'No',
        });
        sanitizedBeneficiaryData = _.assign(beneficiaryData, {
          ['Total Completed Primary Package and at least one Secondary Services']:
            'No',
        });
      }
      break;
    case '15-19':
      // evaluate service variable
      if (
        (_.keys(groupedAnalyticDataByIntervention) ?? []).includes(
          interventionsConstant.hiv_prevention
        ) &&
        evaluateSessionNumberPerIntervention(
          groupedAnalyticDataByIntervention[
            interventionsConstant.hiv_prevention
          ] ?? [],
          '>=',
          9
        ) &&
        (_.keys(groupedAnalyticDataByIntervention) ?? []).includes(
          interventionsConstant.violence_education
        ) &&
        evaluateSessionNumberPerIntervention(
          groupedAnalyticDataByIntervention[
            interventionsConstant.violence_education
          ] ?? [],
          '>=',
          1
        ) &&
        (_.keys(groupedAnalyticDataByIntervention) ?? []).includes(
          interventionsConstant.flatten_toun
        ) &&
        evaluateSessionNumberPerIntervention(
          groupedAnalyticDataByIntervention[
            interventionsConstant.flatten_toun
          ] ?? [],
          '>=',
          9
        ) &&
        (_.keys(groupedAnalyticDataByIntervention) ?? []).includes(
          interventionsConstant.go_girls
        ) &&
        evaluateSessionNumberPerIntervention(
          groupedAnalyticDataByIntervention[interventionsConstant.go_girls] ??
            [],
          '>=',
          11
        ) &&
        (_.keys(groupedAnalyticDataByIntervention) ?? []).includes(
          interventionsConstant.financial_education
        ) &&
        evaluateSessionNumberPerIntervention(
          groupedAnalyticDataByIntervention[
            interventionsConstant.financial_education
          ] ?? [],
          '==',
          4
        ) &&
        (((_.keys(groupedAnalyticDataByIntervention) ?? []).includes(
          interventionsConstant.condom_education
        ) &&
          evaluateSessionNumberPerIntervention(
            groupedAnalyticDataByIntervention[
              interventionsConstant.condom_education
            ] ?? [],
            '>=',
            4
          )) ||
          beneficiaryData['Condom Education/ Provision'] === 'Yes') &&
        beneficiaryData['HIV Risk Assessment'] === 'Yes'
      ) {
        sanitizedBeneficiaryData = _.assign(beneficiaryData, {
          ['Total Completed Primary Package']: 'Yes',
        });
        computeSecondaryCompletedPackage(
          ageBand,
          sanitizedBeneficiaryData,
          groupedAnalyticDataByIntervention,
          analyticDataByBeneficiary
        );
      } else {
        sanitizedBeneficiaryData = _.assign(beneficiaryData, {
          ['Total Completed Primary Package']: 'No',
        });
        sanitizedBeneficiaryData = _.assign(beneficiaryData, {
          ['Total Completed Primary Package and at least one Secondary Services']:
            'No',
        });
      }
      break;
    case '20-24':
      // evaluate service variables
      if (
        (_.keys(groupedAnalyticDataByIntervention) ?? []).includes(
          interventionsConstant.hiv_prevention
        ) &&
        evaluateSessionNumberPerIntervention(
          groupedAnalyticDataByIntervention[
            interventionsConstant.hiv_prevention
          ] ?? [],
          '>=',
          9
        ) &&
        (_.keys(groupedAnalyticDataByIntervention) ?? []).includes(
          interventionsConstant.violence_education
        ) &&
        evaluateSessionNumberPerIntervention(
          groupedAnalyticDataByIntervention[
            interventionsConstant.violence_education
          ] ?? [],
          '>=',
          1
        ) &&
        (_.keys(groupedAnalyticDataByIntervention) ?? []).includes(
          interventionsConstant.flatten_toun
        ) &&
        evaluateSessionNumberPerIntervention(
          groupedAnalyticDataByIntervention[
            interventionsConstant.flatten_toun
          ] ?? [],
          '>=',
          9
        ) &&
        (_.keys(groupedAnalyticDataByIntervention) ?? []).includes(
          interventionsConstant.go_girls
        ) &&
        evaluateSessionNumberPerIntervention(
          groupedAnalyticDataByIntervention[interventionsConstant.go_girls] ??
            [],
          '>=',
          11
        ) &&
        (_.keys(groupedAnalyticDataByIntervention) ?? []).includes(
          interventionsConstant.financial_education
        ) &&
        evaluateSessionNumberPerIntervention(
          groupedAnalyticDataByIntervention[
            interventionsConstant.financial_education
          ] ?? [],
          '==',
          4
        ) &&
        (((_.keys(groupedAnalyticDataByIntervention) ?? []).includes(
          interventionsConstant.condom_education
        ) &&
          evaluateSessionNumberPerIntervention(
            groupedAnalyticDataByIntervention[
              interventionsConstant.condom_education
            ] ?? [],
            '>=',
            4
          )) ||
          beneficiaryData['Condom Education/ Provision'] === 'Yes') &&
        beneficiaryData['HIV Risk Assessment'] === 'Yes'
      ) {
        sanitizedBeneficiaryData = _.assign(beneficiaryData, {
          ['Total Completed Primary Package']: 'Yes',
        });
        computeSecondaryCompletedPackage(
          ageBand,
          sanitizedBeneficiaryData,
          groupedAnalyticDataByIntervention,
          analyticDataByBeneficiary
        );
      } else {
        sanitizedBeneficiaryData = _.assign(beneficiaryData, {
          ['Total Completed Primary Package']: 'No',
        });
        sanitizedBeneficiaryData = _.assign(beneficiaryData, {
          ['Total Completed Primary Package and at least one Secondary Services']:
            'No',
        });
      }
      break;
    default:
      sanitizedBeneficiaryData = beneficiaryData;
  }
  return sanitizedBeneficiaryData;
}

export function computeSecondaryCompletedPackage(
  ageBand: string,
  beneficiaryData: any,
  groupedAnalyticDataByIntervention,
  analyticDataByBeneficiary
) {
  let sanitizedBeneficiaryData = {};
  const ids: string[] = ['h0P6UfkUvLP', 'bH9DpJOIutM', 'veoA322323t'];
  const programStage: string = 'mMjGlK1W0Xo';
  const checkLongFromPrepValue =
    getLongFormPrEPValue(analyticDataByBeneficiary, ids, programStage) === '0'
      ? 'No'
      : 'Yes';
  switch (ageBand) {
    case '10-14':
      if (
        beneficiaryData['HIV Testing and Counseling'] === 'Yes' ||
        ((_.keys(groupedAnalyticDataByIntervention) ?? []).includes(
          interventionsConstant.condom_education
        ) &&
          evaluateSessionNumberPerIntervention(
            groupedAnalyticDataByIntervention[
              interventionsConstant.financial_education
            ] ?? [],
            '>=',
            4
          )) ||
        beneficiaryData['Condom Education/ Provision'] === 'Yes' ||
        beneficiaryData['Educational Subsidies'] === 'Yes' ||
        beneficiaryData['Post Abuse Care Services'] === 'Yes' ||
        beneficiaryData['Post GBV Care (Legal)'] === 'Yes' ||
        ((_.keys(groupedAnalyticDataByIntervention) ?? []).includes(
          interventionsConstant.saving_group
        ) &&
          evaluateSessionNumberPerIntervention(
            groupedAnalyticDataByIntervention[
              interventionsConstant.saving_group
            ] ?? [],
            '>=',
            1
          ))
      ) {
        sanitizedBeneficiaryData = _.assign(beneficiaryData, {
          ['Total Completed Primary Package and at least one Secondary Services']:
            'Yes',
        });
      } else {
        sanitizedBeneficiaryData = _.assign(beneficiaryData, {
          ['Total Completed Primary Package and at least one Secondary Services']:
            'No',
        });
      }
      break;
    case '15-19':
      if (
        beneficiaryData['HIV Testing and Counseling'] === 'Yes' ||
        beneficiaryData['PrEP'] === 'Yes' ||
        beneficiaryData['Contraceptive method mix'] === 'Yes' ||
        beneficiaryData['Post Abuse Care Services'] === 'Yes' ||
        beneficiaryData['Post GBV Care (Legal)'] === 'Yes' ||
        checkLongFromPrepValue === 'Yes' ||
        ((_.keys(groupedAnalyticDataByIntervention) ?? []).includes(
          interventionsConstant.saving_group
        ) &&
          evaluateSessionNumberPerIntervention(
            groupedAnalyticDataByIntervention[
              interventionsConstant.saving_group
            ] ?? [],
            '>=',
            12
          )) ||
        beneficiaryData['Educational Subsidies'] === 'Yes'
      ) {
        sanitizedBeneficiaryData = _.assign(beneficiaryData, {
          ['Total Completed Primary Package and at least one Secondary Services']:
            'Yes',
        });
      } else {
        sanitizedBeneficiaryData = _.assign(beneficiaryData, {
          ['Total Completed Primary Package and at least one Secondary Services']:
            'No',
        });
      }
      break;
    case '20-24':
      if (
        beneficiaryData['HIV Testing and Counseling'] === 'Yes' ||
        beneficiaryData['PrEP'] === 'Yes' ||
        beneficiaryData['Contraceptive method mix'] === 'Yes' ||
        beneficiaryData['Post Abuse Care Services'] === 'Yes' ||
        beneficiaryData['Post GBV Care (Legal)'] === 'Yes' ||
        checkLongFromPrepValue === 'Yes' ||
        beneficiaryData['Parenting (Preg & Breastfeeding)'] === 'Yes' ||
        ((_.keys(groupedAnalyticDataByIntervention) ?? []).includes(
          interventionsConstant.silc
        ) &&
          evaluateSessionNumberPerIntervention(
            groupedAnalyticDataByIntervention[interventionsConstant.silc] ?? [],
            '>=',
            1
          ))
      ) {
        sanitizedBeneficiaryData = _.assign(beneficiaryData, {
          ['Total Completed Primary Package and at least one Secondary Services']:
            'Yes',
        });
      } else {
        sanitizedBeneficiaryData = _.assign(beneficiaryData, {
          ['Total Completed Primary Package and at least one Secondary Services']:
            'No',
        });
      }
      break;
    default:
      sanitizedBeneficiaryData = beneficiaryData;
  }
}

export function evaluateSessionNumberPerIntervention(
  beneficiaryDataList: any[],
  operator: string,
  requiredSessionNumber: any
) {
  if (beneficiaryDataList?.length > 0) {
    const logicalResponse = beneficiaryDataList.some(
      (beneficiaryDataObject) => {
        return eval(
          beneficiaryDataObject['vL6NpUA0rIU'] ??
            '0' + operator + requiredSessionNumber
        );
      }
    );
    return logicalResponse;
  }
  return false;
}
