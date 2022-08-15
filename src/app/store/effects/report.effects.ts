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
import {
  defaultPrepVisitKey,
  getFormattedEventAnalyticDataForReport,
} from 'src/app/shared/helpers/get-formatted-analytica-data-for-report';
import { getFormattedDate } from 'src/app/core/utils/date-formatter.util';
import { MANDATORY_COLUMNS } from './../../core/constant/index';

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
          const sanitizedEventReportAnalyticData = _.filter(
            data,
            (eventReportAnalytic) => {
              const objectWithMandatoryValue = _.pick(
                eventReportAnalytic,
                MANDATORY_COLUMNS
              );
              const isObjectContainValue = _.values(
                objectWithMandatoryValue
              ).every((singleObjectValue) => {
                return singleObjectValue != '';
              });

              if (isObjectContainValue) {
                return eventReportAnalytic;
              }
            }
          );
          observer.next(sanitizedEventReportAnalyticData);
          observer.complete();
        })
        .catch((error) => observer.error(error));
    });
  }

  async getEventReportAnalyticData(analyticParameters: any, reportConfig: any) {
    let eventReportAnalyticData = [];
    const programToProgramStageObject = {};
    const programIds = _.flattenDeep([reportConfig.program]);
    const analyticData = [];
    const analyticParametersWithPaginationFilters = [];
    try {
      let totalOverAllProcess = 0;
      let overAllProcessCount = 0;
      let bufferProcessCount = 0;
      const locations = await this.getAllLocations();
      const eventAnalyticParamaters = _.flattenDeep(
        _.filter(
          analyticParameters,
          (parameter: any) => parameter && !parameter.isEnrollmentAnalytic
        )
      );
      const enrollmentAnalyticParamaters = _.flattenDeep(
        _.filter(
          analyticParameters,
          (parameter: any) => parameter && parameter.isEnrollmentAnalytic
        )
      );
      console.log('formatted data 1');

      for (const analyticParameter of enrollmentAnalyticParamaters) {
        const programId = analyticParameter.programId || '';
        if (programId !== '') {
          const programStages: any = await this.getProgramStagesByProgramId(
            programId
          );
          if (programStages && programStages.length > 0) {
            const programStageId = programStages[0];
            const response: any =
              await this.getAnalyticParameterWithPaginationFilter(
                {
                  ...analyticParameter,
                  dx: _.flattenDeep(
                    _.map(
                      analyticParameter.dx || [],
                      (dataId: string) => `${programStageId}.${dataId}`
                    )
                  ),
                },
                programId,
                reportConfig
              );
            totalOverAllProcess += response.paginationFilters.length;
            analyticParametersWithPaginationFilters.push(response);
          }
        }
      }
      console.log('formatted data 2');

      for (const programId of programIds) {
        for (const analyticParameter of eventAnalyticParamaters) {
          const programStages: any = await this.getProgramStagesByProgramId(
            programId
          );
          programToProgramStageObject[programId] = programStages;
          const response: any =
            await this.getAnalyticParameterWithPaginationFilter(
              analyticParameter,
              programId,
              reportConfig
            );
          totalOverAllProcess += response.paginationFilters.length;
          analyticParametersWithPaginationFilters.push(response);
        }
      }
      console.log('formatted data 3');

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
        console.log('formatted data 4');

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
      console.log('formatted data');
      const formattedEventReportData = getFormattedEventAnalyticDataForReport(
        _.flattenDeep(analyticData),
        reportConfig,
        locations,
        programToProgramStageObject
      );
      eventReportAnalyticData.push(formattedEventReportData);
    } catch (error) {
      console.log({ error });
    }
    eventReportAnalyticData = _.sortBy(_.flattenDeep(eventReportAnalyticData), [
      'District of Service',
      'Last Service Community Council',
    ]);
    const prepVisitKeys = _.filter(
      _.uniq(
        _.flattenDeep(
          _.map(eventReportAnalyticData, (data: any) => _.keys(data))
        )
      ),
      (key: string) => key.includes(`${defaultPrepVisitKey} `)
    );

    return _.map(eventReportAnalyticData, (eventReportAnalytic) => {
      const dataObject = {};
      for (const dxConfigs of reportConfig.dxConfigs || []) {
        const { name } = dxConfigs;
        if (name.includes(`${defaultPrepVisitKey}`)) {
          for (const prepVisitKey of prepVisitKeys) {
            dataObject[prepVisitKey] = eventReportAnalytic[prepVisitKey] || '';
          }
        } else {
          dataObject[name] = eventReportAnalytic[name];
        }
      }
      return dataObject;
    });
  }

  getProgramStagesByProgramId(programId: string) {
    const url = `programs/${programId}.json?fields=id,programStages[id, publicAccess]`;
    return new Promise((resolve, reject) => {
      this.httpClient
        .get(url)
        .pipe(take(1))
        .subscribe(
          (data) => {
            const programStages = _.flattenDeep(
              _.map(
                _.filter(
                  data.programStages || [],
                  (programStage: any) =>
                    programStage &&
                    programStage.publicAccess &&
                    programStage.publicAccess !== '--------'
                ),
                (programStage: any) => programStage.id || []
              )
            );
            resolve(programStages);
          },
          () => reject([])
        );
    });
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
            const locations = _.map(
              data['organisationUnits'] || [],
              (location: any) => {
                const { level, name, ancestors } = location;
                ancestors.push({ name, level });
                return _.omit({ ...location, ancestors }, ['level', 'name']);
              }
            );
            resolve(locations);
          },
          () => reject([])
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
    const pageSize = 1000;
    const isEnrollmentAnalytic =
      analyticParameter.isEnrollmentAnalytic || false;
    const paginationFilters = [];
    const pe = _.join(analyticParameter.pe || [], ';');
    const ou = _.join(analyticParameter.ou || [], ';');
    const startDate = getFormattedDate(new Date('1990-01-01'));
    const endDate = getFormattedDate(new Date());
    const stages = _.map(
      analyticParameter.dx || [],
      (dx: string) => dx.split('.')[0]
    );
    const stage = stages.length > 0 ? stages[0] : '';
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
        : `${pe}`.includes('startDate=')
        ? `${pe}`
        : `dimension=pe:${pe}`;
    const url = isEnrollmentAnalytic
      ? `analytics/enrollments/query/${programUid}.json?${periodDimension}&dimension=ou:${ou}&${dataDimension}&stage=${stage}&displayProperty=NAME&outputType=ENROLLMENT&desc=enrollmentdate`
      : `analytics/events/query/${programUid}.json?${periodDimension}&dimension=ou:${ou}&${dataDimension}&stage=${stage}&displayProperty=NAME&outputType=EVENT&desc=eventdate`;
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
