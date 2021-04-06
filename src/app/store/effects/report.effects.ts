import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as _ from 'lodash';

import {
  LoadReportData,
  AddReportData,
  LoadReportDataFail,
} from '../actions';

@Injectable()
export class ReportDataEffects {
  defaultAnalyticKeys  = ["eventdate","enrollmentdate","tei","ouname","ou"];

  LoadReportData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoadReportData),
      switchMap((actions) =>
        this.getReportAnalyticData(actions).pipe(
          map((analytics: any) => AddReportData({ analytics })),
          catchError((error: any) => of(LoadReportDataFail({ error })))
        )
      )
    )
  );

  getReportAnalyticData(paremeters: any) {
    const{ analyticParameters,reportConfig } = paremeters;
    return  new Observable(observer=>{
      this.getEventReportAnalyticData(analyticParameters,reportConfig ).then(data=>{
        observer.next(data)
        observer.complete()
      }).catch(error=>observer.error(error))
     
    })
  }

  async getEventReportAnalyticData(analyticParameters :any,reportConfig:any ){
    const eventReportAnalyticData = [];
    const programId = reportConfig.program;
    const analyticData = [];
    try {
      for(const analyticParameter of  analyticParameters){
        const response : any= await this.getSingleEventReportAnalyticData(analyticParameter,programId);
        const {data:anlytics, stage :programStage} = response;
        const sanitizedResponse = this.getSanitizedAnalyticData(anlytics,programStage);
        analyticData.push(sanitizedResponse);
      }
      const formattedEventReportData = this.getFormattedEventAnalyticDataForReport(_.flattenDeep(analyticData), reportConfig);
      eventReportAnalyticData.push(formattedEventReportData);
    } catch (error) {
      console.log({error});
    }
    return _.flattenDeep(eventReportAnalyticData);
  }

  getSingleEventReportAnalyticData(analyticParameter : any, programId:string){
    const pe = _.join(analyticParameter.pe || [], ';');
    const ou = _.join(analyticParameter.ou || [], ';');
    const stage = _.map(analyticParameter.dx || [], (dx:string)=> dx.split('.')[0])[0];
    const dataDimension = _.join(_.map(analyticParameter.dx || [], (dx:string)=>`dimension=${dx}` ), '&');
    const url = `analytics/events/query/${programId}.json?dimension=pe:${pe}&dimension=ou:${ou}&${dataDimension}&stage=${stage}&displayProperty=NAME&outputType=EVENT&desc=eventdate&pageSize=100&page=1`;
    return new Promise((resolve, reject)=>{
      this.httpClient.get(url).subscribe(data=> resolve({
        data, stage
      }), error=> reject(error));
    })
  }

  getFormattedEventAnalyticDataForReport(analyticData :Array<any>,reportConfig:any ){
    const groupedAnalyticDataByBeneficiary = _.groupBy(analyticData, "tei");
    return _.flattenDeep(_.map(_.keys(groupedAnalyticDataByBeneficiary), (tei:string)=>{
      const analyticDataByBeneficiary = groupedAnalyticDataByBeneficiary[tei];
      const beneficiaryData = {};
      for(const dxConfig of reportConfig.dxConfig || []){
        const{ id,name,programStage} = dxConfig;
        const eventReportData = _.find(analyticDataByBeneficiary, (data:any)=> {
          return _.keys(data).includes(id) && data["programStage"] && data["programStage"] === programStage;
        });
        //@TODO formatted output value based on type of element fields
        const value = eventReportData ? eventReportData[id] : "";
        beneficiaryData[name] = value;
      }
      return beneficiaryData;
    }));
  }

  getSanitizedAnalyticData(anlytics:any,programStage:string){
    const {headers, rows,metaData} = anlytics;
    const dimensions = metaData && metaData.dimensions ?metaData.dimensions : {};
    const defaultKeys = _.flattenDeep(_.concat(this.defaultAnalyticKeys, _.keys(_.omit(dimensions,_.concat(["ou",'pe',], dimensions.ou || [])))))
    return _.flattenDeep(_.map(rows, (rowData:any)=>{
      const dataObject = {"programStage" : programStage};
      for(const key of defaultKeys){
        const keyIndex = _.findIndex(
          headers || [],
          (header :any) => header && header.name === key
        );
        dataObject[key] = rowData[keyIndex] || "";
      }
      return dataObject;
    }));
  }

  constructor(
    private actions$: Actions,
    private httpClient: NgxDhis2HttpClientService
  ) {}
}
