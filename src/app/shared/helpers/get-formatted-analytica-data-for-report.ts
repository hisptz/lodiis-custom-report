import * as _ from 'lodash';
import { getSanitizesReportValue, getSanitizedDisplayValue } from './report-data.helper';

const districtLevel = 2;
const commmunityCouncilLevel = 3;

export function getFormattedEventAnalyticDataForReport(
    analyticData: Array<any>,
    reportConfig: any,
    locations : any,
  ) {
    const groupedAnalyticDataByBeneficiary = _.groupBy(analyticData, 'tei');
    return _.flattenDeep(
      _.map(_.keys(groupedAnalyticDataByBeneficiary), (tei: string) => {
        const analyticDataByBeneficiary = groupedAnalyticDataByBeneficiary[tei];
        const beneficiaryData = {};
        for (const dxConfigs of reportConfig.dxConfigs || []) {
          const { id, name, programStage, isBoolean, codes, isDate, displayValues } = dxConfigs;
          let value = "";
          if(id === "last_service_community_council"){
              const lastService = getLastServiceFromAnalyticData(analyticDataByBeneficiary)
              const locationId = lastService? lastService['ou'] || "" : "";
              value = getLocationNameById(locations,commmunityCouncilLevel,locationId);
          }else if(id === "district_of_service"){
              value = getDistrictOfService(analyticDataByBeneficiary, locations);
          }else if(id === "date_of_last_service_received"){
            const lastService = getLastServiceFromAnalyticData(analyticDataByBeneficiary);
            value = lastService ? lastService["eventdate"] ||value : value;
          }else{
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
              ? getSanitizesReportValue(value, codes, isBoolean, isDate, displayValues)
              : getSanitizedDisplayValue(value, displayValues);
        }
        return beneficiaryData;
      })
    );
  }

  function getLastServiceFromAnalyticData(analyticDataByBeneficiary : Array<any>){
    let lastService = {};
    const sortedServices = _.reverse(_.sortBy(analyticDataByBeneficiary, ["eventdate"]));
    if(sortedServices.length > 0){
        lastService = {...lastService, ...sortedServices[0]}
    }
    return lastService;
  }

  function getDistrictOfService(analyticDataByBeneficiary : Array<any>, locations : Array<any>){
      const ouIds  = _.uniq(_.flattenDeep(_.map(analyticDataByBeneficiary, (data:any)=> data.ou || [])));
      const locationId = ouIds.length > 0 ? ouIds[0] : "";
      return getLocationNameById(locations,districtLevel, locationId);
  }

  function getLocationNameById(locations : Array<any>, level : number,locationId :string){
      let locationName = "";
      const locationObj = _.find(locations, (data:any)=>data && data.id && data.id === locationId);
      if(locationObj && locationObj.ancestors){
          const location = _.find(locationObj.ancestors||[], (data:any)=>data && data.level === level);
          locationName = location? location.name || locationName : locationName;
      }
      return locationName;
  }

