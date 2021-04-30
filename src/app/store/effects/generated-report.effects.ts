import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, mapTo, mergeMap, take } from 'rxjs/operators';
import {
  addSystemInfo,
  LoadGeneratedReport,
  LoadGeneratedReportFail,
  LoadGeneratedReportSuccess,
} from '../actions';
import { GeneratedReport } from 'src/app/shared/models/generated-report.model';

@Injectable()
export class GeneratedReportEffects {
  reportNameSpace = 'kb-custom-reports';
  url = 'dataStore';

  constructor(
    private actions$: Actions,
    private httpClient: NgxDhis2HttpClientService
  ) {}

  loadGeneratedReports$ = createEffect(() =>
    this.actions$.pipe(ofType(addSystemInfo), mapTo(LoadGeneratedReport()))
  );

  loadingGeneratedReports$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoadGeneratedReport),
      mergeMap((action) =>
        this.getGeneratedReports().pipe(
          map((reports: GeneratedReport[]) => {
            console.log(reports);
            return LoadGeneratedReportSuccess({ reports });
          }),
          catchError((error) => of(LoadGeneratedReportFail({ error })))
        )
      )
    )
  );

  getGeneratedReports() {
    return new Observable((observer) => {
      this.getReportsFromDataStore()
        .then((reportConfig) => {
          console.log(
            `Emitting observable for: ${JSON.stringify(reportConfig)}`
          );

          observer.next(reportConfig);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  getReportNamesFromDataStore(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient
        .get(`${this.url}/${this.reportNameSpace}`)
        .pipe(take(1))
        .subscribe(
          (reportName) => {
            resolve(reportName);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getReportConfigFromDataStore(report: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient
        .get(`${this.url}/${this.reportNameSpace}/${report}`)
        .pipe(take(1))
        .subscribe(
          (report) => {
            resolve(report);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  async getReportsFromDataStore() {
    return await new Promise(async (resolve, reject) => {
      try {
        let reportConfigs = [];
        const reports = await this.getReportNamesFromDataStore();
        for (const report of reports) {
          const reportConfig = await this.getReportConfigFromDataStore(report);
          reportConfigs = [...reportConfigs, reportConfig];
        }
        resolve(reportConfigs);
      } catch (error) {
        reject(error);
      }
    });
  }
}
