import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService, User } from '@iapps/ngx-dhis2-http-client';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { CurrentUser } from 'src/app/shared/models/current-user.model';

import {
  addCurrentUser,
  loadCurrentUser,
  loadCurrentUserFail,
} from '../actions';

@Injectable()
export class UserEffects implements OnInitEffects {
  loadCurrentUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCurrentUser),
      switchMap(() =>
        this.getCurrentUser().pipe(
          map((currentUser: CurrentUser) => addCurrentUser({ currentUser })),
          catchError((error: any) => of(loadCurrentUserFail({ error })))
        )
      )
    )
  );

  getCurrentUser(): Observable<User> {
    const url =
      'me.json?fields=id,name,displayName,email,created,lastUpdated,dataViewOrganisationUnits,organisationUnits,authorities,userGroups,userCredentials,attributeValues[value,attribute[id]]';
    return this.httpClient.get(url);
  }

  ngrxOnInitEffects() {
    return loadCurrentUser();
  }

  constructor(
    private actions$: Actions,
    private httpClient: NgxDhis2HttpClientService
  ) {}
}
