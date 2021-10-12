import { Injectable } from '@angular/core';
import { async } from '@angular/core/testing';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, Observable } from 'rxjs';
import { map, mergeMap, catchError, withLatestFrom, take } from 'rxjs/operators';
import { getFilteredReportByUserImplementingPartner } from 'src/app/pages/home/helpers/report-by-implementing-partner';
import { ConfigService } from 'src/app/pages/home/services/config.service';
import { Report } from 'src/app/shared/models/report.model';
import { DeleteCustomReport, EditCustomReport, LoadCustomReport, LoadSuccessCustomReport } from '../actions/custom-report.actions';
import * as _ from 'lodash';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';


@Injectable()
export class CustomReportEffect {

  constructor(private actions$: Actions ,private httpClient: NgxDhis2HttpClientService,private configService:ConfigService) {}
   implementingPartnerId ;

  loadCustomReports$ = createEffect( () => this.actions$.pipe(
   ofType(LoadCustomReport),
  mergeMap((action) => this.configService.getCustomReportConfigs().pipe(
    map(report => {     
      const reports = [...report['reports']];
       return (LoadSuccessCustomReport({reports}))
    },
    catchError(() => EMPTY)
  ))
 )))

 saveEditedCustomReports$ = createEffect( () => this.actions$.pipe(
  ofType(EditCustomReport),
 mergeMap((action) => 
 this.configService.getCustomReportConfigs().pipe(
   map(report => {

     const reports = [
      ..._.filter(
        [...report['reports']],
        function (individialReport: Report) {
          return individialReport.id != action.report.id;
        }
      ),
      action.report,
    ];
    this.httpClient
    .put("dataStore/kb-custom-reports-config" + '/implementing-partners-reports', {
      reports: reports
      
    }).subscribe();
     return (LoadSuccessCustomReport({reports}))
   },
   catchError(() => EMPTY)
 ))
)))

onDeleteCustomReports$ = createEffect( () => this.actions$.pipe(
  ofType(DeleteCustomReport),
 mergeMap((action) => 
 this.configService.getCustomReportConfigs().pipe(
   map(report => {
     const reports = [
      ..._.filter(
        [...report['reports']],
        function (individialReport: Report) {
          return individialReport.id != action.report.id;
        }
      ),
    ];
    this.httpClient
    .put("dataStore/kb-custom-reports-config" + '/implementing-partners-reports', {
      reports: reports
    }).subscribe();
     return (LoadSuccessCustomReport({reports}))
   },
   catchError(() => EMPTY)
 ))
)))


 getUser():Observable<string>{  
return   new Observable((observer)=>{
  this.configService.getUserImpelementingPartner().then((Id:string)=>{
observer.next(Id)
  }).catch((error)=>{
    observer.error(error)
  })
}) ;

}



}
