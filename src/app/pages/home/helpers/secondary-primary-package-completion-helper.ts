import { getDreamServiceLayeringAgeBand } from './beneficiary-helper';

//hiv test or hts => stage : vAMc8n0YB6m =>  zbHpXUjGv5H

export function evaluationOfSecondaryPrimaryPackageCompletion(
  analyticDataByBeneficiary: any[],
  progranStages: Array<{
    id: string;
    dataElements: string[];
  }>
): string {
  let completed = 'No';
  console.log({ progranStages, type: 'sppc' });
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
