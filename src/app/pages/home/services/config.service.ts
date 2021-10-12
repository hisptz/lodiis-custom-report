import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Report } from 'src/app/shared/models/report.model';
import * as _ from 'lodash';
import { config } from 'process';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  configUrl = 'dataStore/kb-custom-reports-config';

  constructor(private httpClient: NgxDhis2HttpClientService) {}

  getReportConfigs(): Observable<{ reports: Report[] }> {
    return this.httpClient.get(this.configUrl + '/reports');
  }

  getCustomReportConfigs(): Observable<{ reports: Report[] }> {
    return this.httpClient.get(
      this.configUrl + '/implementing-partners-reports'
    );
  }

  async getReportById(id: String): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient
        .get(this.configUrl + '/implementing-partners-reports')
        .subscribe(
          (data) => {
            data['reports'].forEach((reportObject) => {
              if (reportObject['id'] === id) {
                resolve(reportObject);
              }
            });
          },
          () => {
            return { error: 'Report get failed' };
          }
        );
    });
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


}
