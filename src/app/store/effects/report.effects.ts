import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as _ from 'lodash';

import {
  LoadReportData,
  AddReportData,
  LoadReportDataFail,
} from '../actions';

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

  getReportAnalyticData(paremeters: any) {
    console.log(paremeters);
    // const pe = _.join(paremeters.pe || [], ';');
    // const dx = _.join(paremeters.dx || [], ';');
    // const ou = _.join(paremeters.ou || [], ';');
    // const url = `analytics?dimension=dx:${dx}&&filter=pe:${pe}&&filter=ou:${ou}`;
    // return this.httpClient.get(url);
    return  of(null);
  }

  constructor(
    private actions$: Actions,
    private httpClient: NgxDhis2HttpClientService
  ) {}
}
