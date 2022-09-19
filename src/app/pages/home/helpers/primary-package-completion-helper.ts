import * as _ from 'lodash';
import {
  getDreamServiceLayeringAgeBand,
  getSessionCountOnDreamsService,
  getStatusFromBeneficiarySericeData,
} from './dreams-service-layering-helper';

const serviceFormProgramStage = 'bDJq2JWVTbC';
const hivRiskAssessmentProgramStage = 'PGFt6IwdZLM';

const hivAssessnentReference = 'qFwm4RM45gi';
const interventionReference = 'Eug4BXDFLym';

export function evaluationOfPrimaryPackageCompletion(
  analyticDataByBeneficiary: any[],
  progranStages: Array<{
    id: string;
    dataElements: string[];
  }>
): string {
  let completed = 'No';
  const progranStageIds = _.flattenDeep(
    _.map(progranStages, (progranStage: any) => progranStage.id || [])
  );
  const beneficiaryServiceData = _.filter(
    analyticDataByBeneficiary,
    (beneficiaryData: any) => {
      const programStageId = beneficiaryData['programStage'] || '';
      return progranStageIds.includes(programStageId);
    }
  );
  if (beneficiaryServiceData.length > 0) {
    const hasHivRiskAssessment = getStatusFromBeneficiarySericeData(
      beneficiaryServiceData,
      hivRiskAssessmentProgramStage,
      hivAssessnentReference,
      `1`
    );
    const ageBand = getDreamServiceLayeringAgeBand(analyticDataByBeneficiary);
    console.log({ hasHivRiskAssessment, ageBand, beneficiaryServiceData });
    switch (ageBand) {
      case '10-14': {
        // Logics
        break;
      }
      case '15-19': {
        // Logics
        break;
      }
      case '20-24': {
        // Logics
        break;
      }
    }
  }

  return completed;
}
