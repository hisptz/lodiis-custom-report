import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DxConfig } from 'src/app/shared/models/report-config-inteface';
import { ReportModelInterface } from 'src/app/shared/models/report-model-interface';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from '../../services/config.service';
import { uuid } from '../../helpers/dhis2-uid-generator';
import { Report } from 'src/app/shared/models/report.model';

@Component({
  selector: 'app-edit-custom-report',
  templateUrl: './edit-custom-report.component.html',
  styleUrls: ['./edit-custom-report.component.css'],
})
export class EditCustomReportComponent implements OnInit {
  @ViewChild('searchInput') searchInput: ElementRef;
  message: any = '';
  title: string;
  isValid: boolean = false;
  isError: boolean = true;
  isEdit: boolean = true;
  editedReport: Report;
  isLoading:boolean = false;

  arr: (keyof DxConfig)[];
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
    this.searchInput.nativeElement.value = '';
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
      program: ['em38qztTI8s', 'BNsDaCclOiu'],
      includeEnrollmentWithoutService: true,
      allowedImplementingPartners: ['H2CE3Iwdf7v', implementingPartner],
      disableOrgUnitSelection: false,
      disablePeriodSelection: false,
      dxConfigs: dxConfigs,
    };
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // this.message = "data";
  
  }

   async getEditedReport(id: String) {
    this.isLoading = true;
   this.editedReport = await this.configService.getReportById(id);
  if(this.editedReport.name != null){
    this.isLoading = false;
  }
  }
  toString(reportConfigDx:any)
  {
    return JSON.stringify(reportConfigDx)
  }

  getdemo(report: Report) {
    // this.homeComponent.getFilteredReportByUserImplementingPartner()
    this.message = report.name;
    console.log('am in demo');
    console.log(report);
  }
  check = (p: DxConfig, propery: any): p is DxConfig => {
    if (
      [
        'id',
        'name',
        'isDate',
        'isBoolean',
        'isAttribute',
        'programStage',
        'codes',
      ].includes(propery) &&
      p.hasOwnProperty(propery)
    ) {
      return true;
    }
    return false;
  };

  validateMetadata() {
    console.log("this is object")
    console.log(this.message)
    try {
      for (let [key, value] of Object.entries(JSON.parse(this.message)[0])) {
        if (this.check(JSON.parse(this.message)[0], key)) {
        } else {
          throw new Error('Something bad happened');
        }
      }

      setTimeout(() => {
        this.isValid = !this.isValid;
      }, 1000);
      this.isValid = !this.isValid;
    } catch (error) {
      setTimeout(() => {
        this.clearSearch();
      }, 1000);
      this.isValid = !this.isValid;
      this.isError = !this.isError;
    }
  }
  goBack() {
    this.router.navigateByUrl('/report');
  }
  saveMetadata() {
    console.log('this is data');
    // console.log(this.editedReport)
    this.validateMetadata();
    console.log('on save real object');
    this.configService.onCreateReport(
      this.customReportOnSave(
        this.title,
        JSON.parse(this.message),
        'SdDDPA28oVh'
      )
    );
    this.configService.clearEditedReport();
    setTimeout(() => {
      this.router.navigateByUrl('/report');
    }, 3000);
  }
}
