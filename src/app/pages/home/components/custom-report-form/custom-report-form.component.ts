import { Component, Inject, OnInit } from '@angular/core';
import { DxConfig } from 'src/app/shared/models/report-config-inteface';
import { ConfigService } from '../../services/config.service';
import { uuid } from '../../helpers/dhis2-uid-generator';
import { Report } from 'src/app/shared/models/report.model';
import { isArray } from 'highcharts';
import * as _ from 'lodash';
import { checkUserObjectDxConfigCompatibility } from '../../helpers/object-checker-funtion';
import { Store } from '@ngrx/store';
import { State } from 'src/app/store/reducers';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  AddCustomReport,
  EditCustomReport,
} from 'src/app/store/actions/custom-report.actions';
import { getCustomReportById } from 'src/app/store/selectors/custom-report.selector';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-custom-report-form',
  templateUrl: './custom-report-form.component.html',
  styleUrls: ['./custom-report-form.component.css'],
})
export class CustomReporFormComponent implements OnInit {
  dxConfigs: any = '';
  title: string;
  isDxConfigValid: boolean;
  hasDxConfigValidated: boolean;
  currentReport: Report;

  constructor(
    private dialogRef: MatDialog,
    private configService: ConfigService,
    private store: Store<State>,
    @Inject(MAT_DIALOG_DATA) public data: { params: string }
  ) {}

  ngOnInit(): void {
    this.title = '';
    this.dxConfigs = '';
    this.isDxConfigValid = true;
    this.hasDxConfigValidated = false;
    if (this.data.params !== 'true') {
      this.getEditedReport(this.data.params);
    }
  }

  async getEditedReport(id: String) {
    this.store
      .select(getCustomReportById(id))
      .pipe(take(1))
      .subscribe((report: Report) => {
        this.currentReport = report;
      });
    if (this.currentReport.name != null) {
      this.title = this.currentReport.name;
      this.dxConfigs = this.toString(this.currentReport.dxConfigs);
    }
  }

  toString(reportConfigDx: any) {
    return JSON.stringify(reportConfigDx);
  }

  customReportOnSave(
    reportName: string,
    dxConfigs: DxConfig[],
    implementingPartner: string
  ): Report {
    return {
      id: uuid(),
      name: reportName,
      program: ['hOEIHJDrrvz'],
      includeEnrollmentWithoutService: true,
      allowedImplementingPartners: _.uniq(['H2CE3Iwdf7v', implementingPartner]),
      disableOrgUnitSelection: false,
      disablePeriodSelection: false,
      dxConfigs: dxConfigs,
    };
  }

  validateMetadata() {
    this.isDxConfigValid = true;
    this.hasDxConfigValidated = false;
    try {
      if (
        this.title.trim() !== '' &&
        isArray(JSON.parse(this.dxConfigs)) &&
        JSON.parse(this.dxConfigs).length > 0
      ) {
        JSON.parse(this.dxConfigs).forEach((ObjectData) => {
          for (let [key, value] of Object.entries(ObjectData)) {
            if (
              checkUserObjectDxConfigCompatibility(
                JSON.parse(this.dxConfigs),
                key
              )
            ) {
            } else {
              throw new Error('Something bad happened');
            }
          }
        });
        this.isDxConfigValid = true;
      } else {
        this.isDxConfigValid = false;
      }
    } catch (error) {
      this.isDxConfigValid = false;
    }
    this.hasDxConfigValidated = true;
  }
  goBack() {
    this.dialogRef.closeAll();
  }

  customReportOnEditSave(dxConfigs: DxConfig[], report: Report): Report {
    return {
      id: report.id,
      name: this.title,
      program: report.program,
      includeEnrollmentWithoutService: report.includeEnrollmentWithoutService,
      allowedImplementingPartners: report.allowedImplementingPartners,
      disableOrgUnitSelection: report.disableOrgUnitSelection,
      disablePeriodSelection: report.disablePeriodSelection,
      dxConfigs: dxConfigs,
    };
  }

  async saveMetadata() {
    this.validateMetadata();
    if (this.isDxConfigValid) {
      const implementingPartnerId =
        (await this.configService.getUserImpelementingPartner()) as string;
      if (this.data.params != 'true') {
        let report = this.customReportOnEditSave(
          JSON.parse(this.dxConfigs),
          this.currentReport
        );
        this.store.dispatch(EditCustomReport({ report }));
      } else {
        let report = this.customReportOnSave(
          this.title,
          JSON.parse(this.dxConfigs),
          implementingPartnerId
        );
        this.store.dispatch(AddCustomReport({ report }));
      }
      this.dialogRef.closeAll();
    }
  }
}
