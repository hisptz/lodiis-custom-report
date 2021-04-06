import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as _ from 'lodash';

import {
  loadDashboardData,
  addDashboardData,
  loadDashboardDataFail,
} from '../actions';

@Injectable()
export class DashboardDataEffects {
  loadDashboardData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadDashboardData),
      switchMap((actions) =>
        this.getDashboardAnalyticData(actions).pipe(
          map((analytics: any) => addDashboardData({ analytics })),
          catchError((error: any) => of(loadDashboardDataFail({ error })))
        )
      )
    )
  );

  getDashboardAnalyticData(paremeters: any) {
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
