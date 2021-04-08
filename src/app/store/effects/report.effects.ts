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
import { Store } from '@ngrx/store';
import { State } from '../reducers';

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
    

    // this.store.dispatch(
    //   LoadReportData({ analyticParameters, reportConfig: this.selectedReport })
    // );


    const eventReportAnalyticData = [];
    const programId = reportConfig.program;
    const analyticData = [];
    // @TODO determine data paginations
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

  async getSingleEventReportAnalyticData(analyticParameter : any, programId:string){
    let analyticData = {};
    const pe = _.join(analyticParameter.pe || [], ';');
    const ou = _.join(analyticParameter.ou || [], ';');
    const stage = _.map(analyticParameter.dx || [], (dx:string)=> dx.split('.')[0])[0];
    const dataDimension = _.join(_.map(analyticParameter.dx || [], (dx:string)=>`dimension=${dx}` ), '&');
    const pageSize = 500;
    const url = `analytics/events/query/${programId}.json?dimension=pe:${pe}&dimension=ou:${ou}&${dataDimension}&stage=${stage}&displayProperty=NAME&outputType=EVENT&desc=eventdate`;
    try {
      const paginationFilters:any = await this.getPaginatinationFilters(url,pageSize);
      for(const paginationFilter of paginationFilters){
        const data:any = await this.getAnalyticResult(url,paginationFilter);
        if(_.keys(analyticData).length === 0){
          analyticData = {...analyticData, ...data};
        }else{
          const rows = _.concat(analyticData["rows"] || [], data["rows"]||[]);
          analyticData = {...analyticData,rows}
        }
      }
    } catch (error) {
      console.log({error});
    }
    return {data  : analyticData, stage};
  }

  getAnalyticResult(url:string , paginationFilter:string ){
    return new Promise((resolve, reject)=>{
        this.httpClient.get(`${url}&${paginationFilter}`).subscribe(data=> resolve(data), error=> reject(error));
      });
  }

  getPaginatinationFilters(url:string, pageSize :number){
    const paginationFilters = [];
    return new Promise((resolve, reject)=>{
      this.httpClient.get(`${url}&pageSize=1&page=1`).subscribe(anlytics=> {
        const {metaData} = anlytics;
        const pager = metaData && metaData.pager ?metaData.pager : {};
        const total = pager.total || pageSize;
        for (let page = 1; page <= Math.ceil(total / pageSize); page++) {
          paginationFilters.push(`pageSize=${pageSize}&page=${page}`);
        }
        resolve(paginationFilters);
      }, error=> reject(error));
    })
  }

  getFormattedEventAnalyticDataForReport(analyticData :Array<any>,reportConfig:any ){
    const groupedAnalyticDataByBeneficiary = _.groupBy(analyticData, "tei");
    return _.flattenDeep(_.map(_.keys(groupedAnalyticDataByBeneficiary), (tei:string)=>{
      const analyticDataByBeneficiary = groupedAnalyticDataByBeneficiary[tei];
      const beneficiaryData = {};
      for(const dxConfig of reportConfig.dxConfig || []){
        const{ id,name,programStage,isBoolean,code,isDate} = dxConfig;
        const eventReportData = id !=="" && programStage === "" ? 
        _.find(analyticDataByBeneficiary, (data:any)=> {
          return _.keys(data).includes(id);
        }) : _.find(analyticDataByBeneficiary, (data:any)=> {
          return _.keys(data).includes(id) && data["programStage"] && data["programStage"] === programStage;
        });
        let value = eventReportData ? eventReportData[id] : "";
        if(_.keys(beneficiaryData).includes(name) && beneficiaryData[name] !== ""){
          value = beneficiaryData[name];
        }
        beneficiaryData[name] = value !== ""?  this.getSanitizesValue(value,code, isBoolean,isDate): value;
      }
      return beneficiaryData;
    }));
  }

  getSanitizesValue(value :any, code:Array<string>, isBoolean :boolean, isDate:boolean){
    let sanitizedValue = "";
    if(code && code.length > 0){
      sanitizedValue = code.includes(value) ? "Yes" : sanitizedValue;
    }else if(isBoolean){
      sanitizedValue = `${value}` === "1" ? "Yes" : sanitizedValue;
    }else if(isDate){
      sanitizedValue = this.getFormattedDate(value);
    }
    else{
      sanitizedValue = value;
    }
    return sanitizedValue;
  }

  getFormattedDate(date :any) {
    let dateObject = new Date(date);
    if (isNaN(dateObject.getDate())) {
      dateObject = new Date();
    }
    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1;
    const year = dateObject.getFullYear();
    return (
      year +
      (month > 9 ? `-${month}` : `-0${month}`) +
      (day > 9 ? `-${day}` : `-0${day}`)
    );
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
    private httpClient: NgxDhis2HttpClientService,
    private store: Store<State>,
  ) {}
}
