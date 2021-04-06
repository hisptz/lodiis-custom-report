
import * as _ from 'lodash';

export function getAnlyticsParameters(
  selectedOrgUnitItems: Array<any>,
  selectedPeriods: Array<any>,
  dxConfigs : Array<{id:string,name:string, programStage:string,}>
) {
  const pe = _.uniq(
    _.flattenDeep(_.map(selectedPeriods, (period: any) => period.id || []))
  );
  const groupedDxConfigs = _.groupBy(dxConfigs|| [], 'programStage');
  const ou = _.uniq(
    _.flattenDeep(
      _.map(
        selectedOrgUnitItems,
        (organistionUnit: any) => organistionUnit.id || []
      )
    )
  );
  return _.keys(groupedDxConfigs).length > 0 ? _.flattenDeep(_.map(_.keys(groupedDxConfigs),( programStage : String)=>{
    const dx = _.uniq(_.flattenDeep(_.map(groupedDxConfigs[programStage] || [], (groupedDxConfig:{id:string,name:string, programStage:string,})=> groupedDxConfig.id !=="" && groupedDxConfig.programStage !=="" ? `${groupedDxConfig.programStage}.${groupedDxConfig.id}` : [])));
    if(dx.length > 0) {
      return {ou, pe, dx};
    }else{
      return [];
    }
  })) : [];
}
