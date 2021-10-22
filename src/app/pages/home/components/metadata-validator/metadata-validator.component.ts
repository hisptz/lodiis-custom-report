import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { DxConfig } from 'src/app/shared/models/report-config-inteface';
import { ReportModelInterface } from 'src/app/shared/models/report-model-interface';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from '../../services/config.service';
import { uuid } from '../../helpers/dhis2-uid-generator';
import { Report } from 'src/app/shared/models/report.model';
import { isArray } from 'highcharts';
import * as _ from 'lodash';
import { checkUserObjectDxConfigCompatibility } from '../../helpers/object-checker-funtion';
import { Store } from '@ngrx/store';
import { State } from 'src/app/store/reducers';
import { MatDialog } from  '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  AddCustomReport,
  EditCustomReport,
} from 'src/app/store/actions/custom-report.actions';
import { Observable } from 'rxjs';
import {
  getCustomReportById,
  getIsEditedStatus,
} from 'src/app/store/selectors/custom-report.selector';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-metadata-validator',
  templateUrl: './metadata-validator.component.html',
  styleUrls: ['./metadata-validator.component.css'],
})
export class MetadataValidatorComponent implements OnInit {
  message: any = '';
  title: string;
  isValid: boolean = false;
  isError: boolean = true;
  showMessage: boolean = false;
  editedReport: Report;
  isEdited$: Observable<boolean>;

  constructor(
    private  dialogRef : MatDialog,
    private router: Router,
    private configService: ConfigService,
    private store: Store<State>,
    @Inject(MAT_DIALOG_DATA) public data: {params: string}
  ) {}

  async getEditedReport(id: String) {
    this.store
      .select(getCustomReportById(id))
      .pipe(take(1))
      .subscribe((report: Report) => {
        this.editedReport = report;
      });
    if (this.editedReport.name != null) {
      this.title = this.editedReport.name;
      this.message = this.toString(this.editedReport.dxConfigs);
    }
  }
  toString(reportConfigDx: any) {
    return JSON.stringify(reportConfigDx);
  }
  clearSearch() {
    this.isValid = false;
    this.isError = true;
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
  ngOnInit(): void {
    this.isEdited$ = this.store.select(getIsEditedStatus);
    if (this.data.params === 'true') {

    } else {
      this.getEditedReport(this.data.params);
    }
  }

  validateMetadata(): boolean {
    try {
      if (
        isArray(JSON.parse(this.message)) &&
        JSON.parse(this.message).length > 0
      ) {
        JSON.parse(this.message).forEach((ObjectData) => {
          for (let [key, value] of Object.entries(ObjectData)) {
            if (
              checkUserObjectDxConfigCompatibility(
                JSON.parse(this.message),
                key
              )
            ) {
            } else {
              throw new Error('Something bad happened');
            }
          }
        });

        setTimeout(() => {
          this.isValid = !this.isValid;
        }, 1000);
        this.isValid = !this.isValid;
        return true;
      }

      throw new Error('Something bad happened');
    } catch (error) {
      this.showMessage = true;
      setTimeout(() => {
        this.clearSearch();
      }, 500);

      return false;
    }
  }
  goBack() {
   this.dialogRef.closeAll();  }

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
    if (this.validateMetadata()) {
      const implementingPartnerId =
        (await this.configService.getUserImpelementingPartner()) as string;
      if (this.data.params != 'true') {
        let report = this.customReportOnEditSave(
          JSON.parse(this.message),
          this.editedReport
        );

        this.store.dispatch(EditCustomReport({ report }));
      } else {
        let report = this.customReportOnSave(
          this.title,
          JSON.parse(this.message),
          implementingPartnerId
        );
        this.store.dispatch(AddCustomReport({ report }));
      }
      if (this.isEdited$) {
        this.router.navigateByUrl('/report');
      }
    }
  }
}
