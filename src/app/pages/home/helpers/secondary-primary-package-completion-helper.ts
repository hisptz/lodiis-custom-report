import * as _ from 'lodash';
import {
  getDreamServiceLayeringAgeBand,
  getSessionCountOnDreamsService,
  getStatusFromBeneficiarySericeData,
} from './dreams-service-layering-helper';

const htsProgramStage = 'vAMc8n0YB6m';
const serviceFormProgramStage = 'bDJq2JWVTbC';
const condomEducationProgramStage = 'NXsIkG9Q1BA';

const interventionReference = 'Eug4BXDFLym';
const condomEducationReference = 'd4AJf9yiKpL';
const hivTestReference = 'zbHpXUjGv5H';

//Prep long forms :: mMjGlK1W0Xo
// de : hiv neg => veoA322323t, < 60 => bH9DpJOIutM, weight => h0P6UfkUvLP
//Prep short forms :: Qw8c20q5V0w => VtmkYCQkBQw

// post gbv clinical :: yK0ENCuwPqh => mnYT2rZyGgJ
// post gbv legal :: VLW93YjZOyf => qML4gVZ2UFc

// parenting :: N5SlNqQuMyC => NhUVtfObJFw

// family planning/srh :: A7Tl3vML6as => uciT2F6ByYO

//Referrals :: MkyTrLeBG8I
// at facility => OrC9Bh2bcFz
// at community => rsh5Kvx6qAU
// service provided => hXyqgOWZ17b

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
    const hasCondomEductionProvided = getStatusFromBeneficiarySericeData(
      beneficiaryServiceData,
      condomEducationProgramStage,
      condomEducationReference,
      `1`
    );
    const condomEducationSessions = getSessionCountOnDreamsService(
      beneficiaryServiceData,
      serviceFormProgramStage,
      'CondomEducationProvision',
      interventionReference
    );
    const silcSessions = getSessionCountOnDreamsService(
      beneficiaryServiceData,
      serviceFormProgramStage,
      'SILC',
      interventionReference
    );
    const savingGroupsSessions = getSessionCountOnDreamsService(
      beneficiaryServiceData,
      serviceFormProgramStage,
      'SAVING GROUP',
      interventionReference
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
