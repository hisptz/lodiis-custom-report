import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { Observable } from 'rxjs';
import { Report } from 'src/app/shared/models/report.model';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  configUrl = 'dataStore/kb-custom-reports-config/reports';

  constructor(private httpClient: NgxDhis2HttpClientService) {}

  getReportConfigs(): Observable<{ reports: Report[] }> {
    return this.httpClient.get(this.configUrl);
  }
}
