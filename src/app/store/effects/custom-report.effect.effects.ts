import { Injectable } from '@angular/core';
import { async } from '@angular/core/testing';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, Observable, of } from 'rxjs';
import {
  map,
  mergeMap,
  catchError,
  withLatestFrom,
  take,
  mapTo,
} from 'rxjs/operators';
import { getFilteredReportByUserImplementingPartner } from 'src/app/pages/home/helpers/report-by-implementing-partner';
import { ConfigService } from 'src/app/pages/home/services/config.service';
import { Report } from 'src/app/shared/models/report.model';
import {
  AddCustomReport,
  DeleteCustomReport,
  EditCustomReport,
  LoadCustomReport,
  LoadSuccessCustomReport,
} from '../actions/custom-report.actions';
import * as _ from 'lodash';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { AddReportData, LoadReportData } from '../actions/report.actions';
import { addCurrentUser } from '../actions/user.actions';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { getCurrentUserImplementingPartner } from '../selectors/user.selectors';

@Injectable()
export class CustomReportEffect {
  constructor(
    private actions$: Actions,
    private httpClient: NgxDhis2HttpClientService,
    private configService: ConfigService,
    private store: Store<State>
  ) {}

  configUrl: string = 'dataStore/kb-custom-reports-config/implementing-partners-reports';
  loadCustomReports$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoadCustomReport),
      withLatestFrom(this.store.select(getCurrentUserImplementingPartner)),
      mergeMap(([action, implementingPartnerId]) =>
        this.configService.getCustomReportConfigs().pipe(
          map(
            (report) => {
              const reports = getFilteredReportByUserImplementingPartner(
                [...report['reports']],
                implementingPartnerId
              );
              return LoadSuccessCustomReport({ reports });
            },
            catchError(() => EMPTY)
          )
        )
      )
    )
  );

  onInitReportsEffect = createEffect(() =>
    this.actions$.pipe(ofType(addCurrentUser), mapTo(LoadCustomReport()))
  );

  saveEditedCustomReports$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EditCustomReport),
      mergeMap((action) =>
        this.configService.getCustomReportConfigs().pipe(
          map(
            (report) => {
              const reports = [
                ..._.filter([...report['reports']], function (
                  individialReport: Report
                ) {
                  return individialReport.id != action.report.id;
                }),
                action.report,
              ];
              this.httpClient
                .put(this.configUrl, {
                  reports: reports,
                })
                .subscribe();
              return LoadSuccessCustomReport({ reports });
            },
            catchError(() => EMPTY)
          )
        )
      )
    )
  );

  onDeleteCustomReports$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DeleteCustomReport),
      mergeMap((action) =>
        this.configService.getCustomReportConfigs().pipe(
          map(
            (report) => {
              const reports = [
                ..._.filter([...report['reports']], function (
                  individialReport: Report
                ) {
                  return individialReport.id != action.report.id;
                }),
              ];
              this.httpClient
                .put(this.configUrl, {
                  reports: reports,
                })
                .subscribe();
              return LoadSuccessCustomReport({ reports });
            },
            catchError(() => EMPTY)
          )
        )
      )
    )
  );

  onAddCustomReportEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AddCustomReport),
      mergeMap((action) =>
        this.configService.getCustomReportConfigs().pipe(
          map(
            (report) => {
              if (
                _.find(report['reports'], { id: action.report.id }) != null ||
                _.find(report['reports'], { id: action.report.id }) != undefined
              ) {
                const reports = [
                  ..._.remove(report['reports']['dxConfigs'] ?? [], function (
                    report
                  ) {
                    return !action.report.dxConfigs.includes(report['id']);
                  }),
                  action.report,
                ];
                this.httpClient
                  .put(this.configUrl, {
                    reports: reports,
                  })
                  .subscribe((configs) => {});

                return LoadSuccessCustomReport({ reports });
              } else {
                const reports = [...report['reports'], action.report];
                this.httpClient
                  .put(this.configUrl, {
                    reports: reports,
                  })
                  .subscribe((configs) => {});
                return LoadSuccessCustomReport({ reports });
              }
            },
            catchError(() => EMPTY)
          )
        )
      )
    )
  );
}
