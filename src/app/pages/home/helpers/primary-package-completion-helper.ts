import { getDreamServiceLayeringAgeBand } from './beneficiary-helper';

export function evaluationOfPrimaryPackageCompletion(
  analyticDataByBeneficiary: any[]
): string {
  let completed = 'No';
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
