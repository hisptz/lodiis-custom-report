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
  UpdateReportProgress,
} from '../actions';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { getSanitizesReportValue ,getSanitizedAnalyticData, getProgressPercentage} from 'src/app/shared/helpers/report-data.helper';

@Injectable()
export class ReportDataEffects {

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

  getReportAnalyticData(parameters: any) {
    const { analyticParameters, reportConfig } = parameters;
    return new Observable((observer) => {
      this.getEventReportAnalyticData(analyticParameters, reportConfig)
        .then((data) => {
          observer.next(data);
          observer.complete();
        })
        .catch((error) => observer.error(error));
    });
  }

  async getEventReportAnalyticData(analyticParameters: any, reportConfig: any) {
    const eventReportAnalyticData = [];
    const programId = reportConfig.program;
    const analyticData = [];
    const analyticParametersWithPaginationFilters = [];
    try {
      let totalOverAllProcess = 0;
      let overAllProcessCount = 0;
      let bufferProcessCount = 0;
      for (const analyticParameter of analyticParameters) {
        const response: any = await this.getAnalyticParameterWithPaginationFilter(
          analyticParameter,
          programId
        );
        totalOverAllProcess += response.paginationFilters.length;
        analyticParametersWithPaginationFilters.push(response);
      }
      for (const analyticParameter of _.flattenDeep(
        analyticParametersWithPaginationFilters
      )) {
        const { url, stage, paginationFilters } = analyticParameter;
        bufferProcessCount += paginationFilters.length;
        this.updateProgressStatus(
          bufferProcessCount,
          overAllProcessCount,
          totalOverAllProcess
        );
        const response: any = await this.getSingleEventReportAnalyticData(
          url,
          stage,
          paginationFilters,
          bufferProcessCount,
          overAllProcessCount,
          totalOverAllProcess
        );
        const {
          data: anlytics,
          stage: programStage,
          overAllProcessCount: currentOverAllProcessCount,
        } = response;
        overAllProcessCount = currentOverAllProcessCount;
        const sanitizedResponse = getSanitizedAnalyticData(
          anlytics,
          programStage
        );
        analyticData.push(sanitizedResponse);
      }
      const formattedEventReportData = this.getFormattedEventAnalyticDataForReport(
        _.flattenDeep(analyticData),
        reportConfig
      );
      eventReportAnalyticData.push(formattedEventReportData);
    } catch (error) {
      console.log({ error });
    }
    return _.flattenDeep(eventReportAnalyticData);
  }

  async getSingleEventReportAnalyticData(
    url: string,
    stage: string,
    paginationFilters: any,
    bufferProcessCount: number,
    overAllProcessCount: number,
    totalOverAllProcess: number
  ) {
    let analyticData = {};
    try {
      for (const paginationFilter of paginationFilters) {
        const data: any = await this.getAnalyticResult(url, paginationFilter);
        overAllProcessCount++;
        this.updateProgressStatus(
          bufferProcessCount,
          overAllProcessCount,
          totalOverAllProcess
        );
        if (_.keys(analyticData).length === 0) {
          analyticData = { ...analyticData, ...data };
        } else {
          const rows = _.concat(analyticData['rows'] || [], data['rows'] || []);
          analyticData = { ...analyticData, rows };
        }
      }
    } catch (error) {
      console.log({ error });
    }
    return { data: analyticData, stage, overAllProcessCount };
  }

  async getAnalyticParameterWithPaginationFilter(
    analyticParameter: any,
    programId: string
  ) {
    const paginationFilters = [];
    const pe = _.join(analyticParameter.pe || [], ';');
    const ou = _.join(analyticParameter.ou || [], ';');
    const stage = _.map(
      analyticParameter.dx || [],
      (dx: string) => dx.split('.')[0]
    )[0];
    const dataDimension = _.join(
      _.map(analyticParameter.dx || [], (dx: string) => `dimension=${dx}`),
      '&'
    );
    const pageSize = 500;
    const url = `analytics/events/query/${programId}.json?dimension=pe:${pe}&dimension=ou:${ou}&${dataDimension}&stage=${stage}&displayProperty=NAME&outputType=EVENT&desc=eventdate`;
    try {
      const response: any = await this.getPaginatinationFilters(url, pageSize);
      paginationFilters.push(response);
    } catch (error) {
      console.log({ error });
    }
    return {
      ...analyticParameter,
      url,
      stage,
      paginationFilters: _.flattenDeep(paginationFilters),
    };
  }

  getAnalyticResult(url: string, paginationFilter: string) {
    return new Promise((resolve, reject) => {
      this.httpClient.get(`${url}&${paginationFilter}`).subscribe(
        (data) => resolve(data),
        (error) => reject(error)
      );
    });
  }

  getPaginatinationFilters(url: string, pageSize: number) {
    const paginationFilters = [];
    return new Promise((resolve, reject) => {
      this.httpClient.get(`${url}&pageSize=1&page=1`).subscribe(
        (anlytics) => {
          const { metaData } = anlytics;
          const pager = metaData && metaData.pager ? metaData.pager : {};
          const total = pager.total || pageSize;
          for (let page = 1; page <= Math.ceil(total / pageSize); page++) {
            paginationFilters.push(`pageSize=${pageSize}&page=${page}`);
          }
          resolve(paginationFilters);
        },
        (error) => reject(error)
      );
    });
  }

  getFormattedEventAnalyticDataForReport(
    analyticData: Array<any>,
    reportConfig: any
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
            console.log({key:"last_service_community_council",id, analyticDataByBeneficiary})
          }else if(id === "district_of_service"){
            console.log({key:"district_of_service",id, analyticDataByBeneficiary})
          }else if(id === "date_of_last_service_received"){
            console.log({key:"date_of_last_service_received",id, analyticDataByBeneficiary})
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

  updateProgressStatus(
    bufferProcessCount: number,
    overAllProcessCount: number,
    totalOverAllProcess: number
  ) {
    const bufferProgress = getProgressPercentage(
      bufferProcessCount,
      totalOverAllProcess
    );
    const overAllProgress = getProgressPercentage(
      overAllProcessCount,
      totalOverAllProcess
    );
    this.store.dispatch(
      UpdateReportProgress({ overAllProgress, bufferProgress })
    );
  }

  constructor(
    private actions$: Actions,
    private httpClient: NgxDhis2HttpClientService,
    private store: Store<State>
  ) {}
}
