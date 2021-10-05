import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DxConfig } from 'src/app/shared/models/report-config-inteface';
import { ReportModelInterface } from 'src/app/shared/models/report-model-interface';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from '../../services/config.service';
import { Report } from 'src/app/shared/models/report.model';
import { isArray } from 'highcharts';
import { checkUserObjectDxConfigCompatibility } from '../../helpers/object-checker-funtion';

@Component({
  selector: 'app-edit-custom-report',
  templateUrl: './edit-custom-report.component.html',
  styleUrls: ['./edit-custom-report.component.css'],
})
export class EditCustomReportComponent implements OnInit {
  @ViewChild('searchInput') searchInput: ElementRef;
  message: any = '';
  title: string = '';
  isValid: boolean = false;
  isError: boolean = true;
  editedReport: Report;
  isLoading: boolean = false;
  showMessage: boolean = false;
  @Input() reportModel?: ReportModelInterface;

  constructor(
    private router: Router,
    private configService: ConfigService,
    private activeRoute: ActivatedRoute
  ) {
    let id: string = this.activeRoute.snapshot.params['id'];
    this.getEditedReport(id);
  }

  clearSearch() {
    this.showMessage = true;
    this.isValid = false;
    this.isError = true;
  }
  customReportOnSave(dxConfigs: DxConfig[], report: Report): Report {
  
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
  ngOnInit(): void {}

  async getEditedReport(id: String) {
    this.isLoading = true;
    this.editedReport = await this.configService.getReportById(id);
    if (this.editedReport.name != null) {
      this.isLoading = false;
      this.title = this.editedReport.name;
    }
  }
  toString(reportConfigDx: any) {
    return JSON.stringify(reportConfigDx);
  }

  validateMetadata(): boolean {
    try {
      if (
        isArray(JSON.parse(this.message)) &&
        JSON.parse(this.message).length > 0
      ) {
        JSON.parse(this.message).forEach((ObjectData) => {
          for (let [key, value] of Object.entries(ObjectData)) { 
            if (checkUserObjectDxConfigCompatibility(JSON.parse(this.message), key)) {} else {
              throw new Error('Object keys are not compatible');
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
      this.configService.onEditCustomReport(
        this.customReportOnSave(JSON.parse(this.message), this.editedReport)
      );
      setTimeout(() => {
        this.router.navigateByUrl('/report');
      }, 3000);
    }
  }
}
