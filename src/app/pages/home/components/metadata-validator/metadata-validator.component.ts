import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DxConfig } from 'src/app/shared/models/report-config-inteface';
import { ReportModelInterface } from 'src/app/shared/models/report-model-interface';
import { Router } from '@angular/router';
import { ConfigService } from '../../services/config.service';
import { uuid } from '../../helpers/dhis2-uid-generator';
import { Report } from 'src/app/shared/models/report.model';
import { isArray } from 'highcharts';
import * as _ from 'lodash';
import { checkUserObjectDxConfigCompatibility } from '../../helpers/object-checker-funtion';

@Component({
  selector: 'app-metadata-validator',
  templateUrl: './metadata-validator.component.html',
  styleUrls: ['./metadata-validator.component.css'],
})
export class MetadataValidatorComponent implements OnInit {
  @ViewChild('searchInput') searchInput: ElementRef;
  message: any = '';
  title: string;
  isValid: boolean = false;
  isError: boolean = true;
  showMessage: boolean = false;
  editedReport: Report;

  arr: (keyof DxConfig)[];
  @Input() reportModel?: ReportModelInterface;

  constructor(private router: Router, private configService: ConfigService) {}

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
  ngOnInit(): void {}

  validateMetadata(): boolean {
    try {
      if (
        isArray(JSON.parse(this.message)) &&
        JSON.parse(this.message).length > 0
      ) {
        JSON.parse(this.message).forEach((ObjectData) => {
          for (let [key, value] of Object.entries(ObjectData)) {
            if (checkUserObjectDxConfigCompatibility(JSON.parse(this.message), key)) {} else {
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
        this.showMessage = false;
      }, 500);

      return false;
    }
  }
  goBack() {
    this.router.navigateByUrl('/report');
  }
  async saveMetadata() {
    if (this.validateMetadata()) {
      const implementingPartnerId = (await this.configService.getUserImpelementingPartner()) as string;
      this.configService.onCreateReport(
        this.customReportOnSave(
          this.title,
          JSON.parse(this.message),
          implementingPartnerId
        )
      );
      setTimeout(() => {
        this.router.navigateByUrl('/report');
      }, 3000);
    }
  }
}
