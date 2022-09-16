import { getDreamServiceLayeringAgeBand } from './beneficiary-helper';

const hivAssessnentReference = 'qFwm4RM45gi';
const interventionReference = 'Eug4BXDFLym';
const sessionNumberReference = 'vL6NpUA0rIU';

//

// qFwm4RM45gi :  HIV riks assessment :: stage=> PGFt6IwdZLM
// vL6NpUA0rIU :  session number :: stage=> bDJq2JWVTbC
// Eug4BXDFLym :  type of intervenntions :: stage=> bDJq2JWVTbC
//
export function evaluationOfPrimaryPackageCompletion(
  analyticDataByBeneficiary: any[],
  progranStages: Array<{
    id: string;
    dataElements: string[];
  }>
): string {
  let completed = 'No';
  console.log({ progranStages, type: 'ppc' });
  const ageBand = getDreamServiceLayeringAgeBand(analyticDataByBeneficiary);
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
  return completed;
}
