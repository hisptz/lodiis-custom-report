import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import * as _ from 'lodash';

import {
  LoadReportData,
  AddReportData,
  LoadReportDataFail,
  UpdateReportProgress,
} from '../actions';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import {
  getSanitizedAnalyticData,
  getProgressPercentage,
} from 'src/app/shared/helpers/report-data.helper';
import { getFormattedEventAnalyticDataForReport } from 'src/app/shared/helpers/get-formatted-analytica-data-for-report';
import { getFormattedDate } from 'src/app/core/utils/date-formatter.util';

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
      const locations = await this.getAllLocations();
      for (const analyticParameter of analyticParameters) {
        const response: any =
          await this.getAnalyticParameterWithPaginationFilter(
            analyticParameter,
            programId,
            reportConfig
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
          data: Analytics,
          stage: programStage,
          overAllProcessCount: currentOverAllProcessCount,
        } = response;
        overAllProcessCount = currentOverAllProcessCount;
        const sanitizedResponse = getSanitizedAnalyticData(
          Analytics,
          programStage
        );
        analyticData.push(sanitizedResponse);
      }
      const formattedEventReportData = getFormattedEventAnalyticDataForReport(
        _.flattenDeep(analyticData),
        reportConfig,
        locations
      );
      eventReportAnalyticData.push(formattedEventReportData);
    } catch (error) {
      console.log({ error });
    }
    return _.sortBy(_.flattenDeep(eventReportAnalyticData), [
      'District of Service',
      'Last Service Community Council',
    ]);
  }

  getAllLocations() {
    const url =
      'organisationUnits.json?fields=id,name,level,ancestors[name,level]&paging=false';
    return new Promise((resolve, reject) => {
      this.httpClient
        .get(url)
        .pipe(take(1))
        .subscribe(
          (data) => {
            const loctions = _.map(
              data['organisationUnits'] || [],
              (location: any) => {
                const { level, name, ancestors } = location;
                ancestors.push({ name, level });
                return _.omit({ ...location, ancestors }, ['level', 'name']);
              }
            );
            resolve(loctions);
          },
          (error) => reject([])
        );
    });
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
    programId: string,
    reportConfig: any
  ) {
    const paginationFilters = [];
    const pe = _.join(analyticParameter.pe || [], ';');
    const ou = _.join(analyticParameter.ou || [], ';');
    const startDate = getFormattedDate(new Date('1990-01-01'));
    const endDate = getFormattedDate(new Date());
    const stage = _.map(
      analyticParameter.dx || [],
      (dx: string) => dx.split('.')[0]
    )[0];
    const dataDimension = _.join(
      _.map(analyticParameter.dx || [], (dx: string) => `dimension=${dx}`),
      '&'
    );
    const programUid =
      analyticParameter.programId === ''
        ? programId
        : analyticParameter.programId;
    const periodDimension =
      reportConfig && reportConfig.disablePeriodSelection
        ? `startDate=${startDate}&endDate=${endDate}`
        : `dimension=pe:${pe}`;
    const pageSize = 1000;
    const url = `analytics/events/query/${programUid}.json?${periodDimension}&dimension=ou:${ou}&${dataDimension}&stage=${stage}&displayProperty=NAME&outputType=EVENT&desc=eventdate`;
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
      this.httpClient
        .get(`${url}&${paginationFilter}`)
        .pipe(take(1))
        .subscribe(
          (data) => resolve(data),
          (error) => reject(error)
        );
    });
  }

  getPaginatinationFilters(url: string, pageSize: number) {
    const paginationFilters = [];
    return new Promise((resolve, reject) => {
      this.httpClient
        .get(`${url}&pageSize=1&page=1`)
        .pipe(take(1))
        .subscribe(
          (Analytics) => {
            const { metaData } = Analytics;
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
