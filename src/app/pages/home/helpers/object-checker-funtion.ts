import { DxConfig } from "src/app/shared/models/report-config-inteface";

export function check  (
    p: DxConfig,
    propery: any
  ): p is DxConfig {
    if (
      [
        'id',
        'name',
        'isDate',
        'isBoolean',
        'isAttribute',
        'programStage',
      ].map(key=>{
        if(p.hasOwnProperty(key)){
          return true;
        }
        else{
          return false;
        }
      }) &&
      [
        'id',
        'name',
        'isDate',
        'isBoolean',
        'isAttribute',
        'programStage',
        'codes',
        'displayValues'
      ].includes(propery) 
    ) {
      return true;
    }
    return false;
  };