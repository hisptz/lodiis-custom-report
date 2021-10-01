import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { Observable,Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { Report } from 'src/app/shared/models/report.model';
import * as _ from 'lodash';


@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private subject = new Subject<any>();
  configUrl = 'dataStore/kb-custom-reports-config';


  constructor(private httpClient: NgxDhis2HttpClientService) {}

  
  getReportConfigs(): Observable<{ reports: Report[] }> {
    return this.httpClient.get(this.configUrl+'/reports');
  }

  getCustomReportConfigs(): Observable<{ reports: Report[] }> {
    return this.httpClient.get(this.configUrl+'/implementing-partners-reports');
  }

  async onCreateReport(reports:Report){

    this.httpClient.post(this.configUrl+'/implementing-partners-reports',{"reports":reports});

    this.httpClient.get(this.configUrl+'/implementing-partners-reports')
    .subscribe((data)=>{

  // this.httpClient.put(this.configUrl+'/implementing-partners-reports',{"reports":[...data['reports']??[],reports]});

  if(_.find(data['reports'],{'id':reports.id})!=null || _.find(data['reports'],{'id':reports.id}) != undefined){
    console.log("pass 3")
    this.httpClient.put(this.configUrl+'/implementing-partners-reports',{"reports":[...(_.remove(data['reports']['dxConfigs']??[],function(report){
      return !reports.dxConfigs.includes(report['id'])
    })),reports]});

  }else{

console.log(reports);
this.httpClient.put(this.configUrl+'/implementing-partners-reports',{"reports":reports});

 }
})
  }

  async onDeleteReport(report:Report)
  {
    // this.httpClient.delete()
  }
async getReportById(id:String):Promise<any>{
return new Promise((resolve, reject) =>{
  this.httpClient.get(this.configUrl+'/implementing-partners-reports')
  .subscribe((data)=>{
    (data['reports']).forEach(reportObject => {
if(reportObject['id'] === id){
  resolve (reportObject)
}
    });
  },()=>{
    return {"errir":"take"}
  })
})
}

  async getExtendeReportMetadata(programIds: String[] = []) {


    const programMetadata = {};
    const filter = `filter=id:in:[${_.join(programIds, ',')}]`;
    const fields =
      'fields=id,programStages[id],programTrackedEntityAttributes[trackedEntityAttribute[id]]';
    const url = `programs.json?&${filter}&${fields}`;
    return new Promise((resolve, reject) => {
      this.httpClient
        .get(`${url}`)
        .pipe(take(1))
        .subscribe(
          (data) => {
            for (const program of data.programs || []) {
              const { id, programStages, programTrackedEntityAttributes } =
                program;
              const attributes = _.uniq(
                _.flattenDeep(
                  _.map(
                    programTrackedEntityAttributes,
                    (programTrackedEntityAttribute: any) =>
                      programTrackedEntityAttribute &&
                      programTrackedEntityAttribute.trackedEntityAttribute &&
                      programTrackedEntityAttribute.trackedEntityAttribute.id
                        ? programTrackedEntityAttribute.trackedEntityAttribute
                            .id
                        : []
                  )
                )
              );
              programMetadata[id] = {
                id,
                attributes,
                programStages: _.uniq(
                  _.flattenDeep(
                    _.map(
                      programStages,
                      (programStage) => programStage.id || []
                    )
                  )
                ),
              };
            }
            resolve(programMetadata);
          },
          () => {
            resolve(programMetadata);
          }
        );
    });
  }

  async getUserImpelementingPartner() {
    const implementingPartnerAttributeId = 'wpiLo7DTwKF';
    let implementingPartnerId = '';
    const currentUserUrl = `me.json?fields=attributeValues[value,attribute[id]]`;
    return new Promise((resolve, reject) => {
      this.httpClient
        .get(`${currentUserUrl}`)
        .pipe(take(1))
        .subscribe(
          (data) => {
            const userAttribute = _.find(
              data.attributeValues || [],
              (dataObject: any) =>
                dataObject &&
                dataObject.attribute &&
                dataObject.attribute.id &&
                dataObject.attribute.id === implementingPartnerAttributeId
            );
            implementingPartnerId =
              userAttribute && userAttribute.hasOwnProperty('value')
                ? userAttribute.value
                : implementingPartnerId;
            resolve(implementingPartnerId);
          },
          () => {
            resolve(implementingPartnerId);
          }
        );
    });
  }
  sendEditReport(report: Report) {
    this.subject.next(report);
}

clearEditedReport() {
    this.subject.next();
}

 getEditedReport(): Observable<Report> {
    return this.subject.asObservable();
}
}
