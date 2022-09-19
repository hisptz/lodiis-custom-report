import * as _ from 'lodash';
import {
  getDreamServiceLayeringAgeBand,
  getStatusFromBeneficiarySericeData,
} from './dreams-service-layering-helper';

const htsProgramStage = 'vAMc8n0YB6m';
const hivTestReference = 'zbHpXUjGv5H';

export function evaluationOfSecondaryPrimaryPackageCompletion(
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
    const ageBand = getDreamServiceLayeringAgeBand(analyticDataByBeneficiary);
    const hasTestedForHiv = getStatusFromBeneficiarySericeData(
      beneficiaryServiceData,
      htsProgramStage,
      hivTestReference,
      '1'
    );
   // console.log({ hasTestedForHiv, ageBand, beneficiaryServiceData });
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
