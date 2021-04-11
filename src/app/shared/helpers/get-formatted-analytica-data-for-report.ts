import * as _ from 'lodash';
import { getSanitizesReportValue } from './report-data.helper';

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
        for (const dxConfig of reportConfig.dxConfig || []) {
          const { id, name, programStage, isBoolean, code, isDate } = dxConfig;
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
                    data['programStage'] &&
                    data['programStage'] === programStage
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
              ? getSanitizesReportValue(value, code, isBoolean, isDate)
              : value;
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
      const ouIds  = _.uniq(_.flattenDeep(_.map(analyticDataByBeneficiary, data=> data["ou"] || [])));
      const locationId = ouIds.length > 0 ? ouIds[0] : "";
      return getLocationNameById(locations,districtLevel, locationId);
  }

  function getLocationNameById(locations : Array<any>, level : number,locationId :string){
      let locationName = "";
      console.log({locationId, locations,level});
      return locationId;
  }
