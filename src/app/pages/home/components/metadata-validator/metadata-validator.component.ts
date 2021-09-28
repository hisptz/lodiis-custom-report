import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { SingleReportConfiguration } from 'src/app/shared/models/report-config-inteface';
import { ReportModelInterface } from 'src/app/shared/models/report-model-interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-metadata-validator',
  templateUrl: './metadata-validator.component.html',
  styleUrls: ['./metadata-validator.component.css'],
})
export class MetadataValidatorComponent {
  @ViewChild('searchInput') searchInput: ElementRef;
  message: any;
  title: string;
  isValid: boolean = false;
  isError: boolean = true;

  arr: (keyof SingleReportConfiguration)[];
  @Input() reportModel?: ReportModelInterface;

  constructor(private router: Router) {}

  clearSearch() {
    this.searchInput.nativeElement.value = '';
    this.isValid = false;
    this.isError = true;
  }

  check = (
    p: SingleReportConfiguration,
    propery: any
  ): p is SingleReportConfiguration => {
    if (
      [
        'id',
        'name',
        'program',
        'dxConfigs',
        'disablePeriodSelection',
        'allowedImplementingPartners',
        'includeEnrollmentWithoutService',
        'disableOrgUnitSelection',
      ].includes(propery) &&
      p.hasOwnProperty(propery)
    ) {
      return true;
    }
    return false;
  };

  validateMetadata() {
    try {
      for (let [key, value] of Object.entries(JSON.parse(this.message))) {
        if (this.check(JSON.parse(this.message), key)) {        
        } else {
          throw new Error('Something bad happened');
        }

      }
      this.isValid =!this.isValid;
      setTimeout(()=>{
        this.router.navigateByUrl('/report')
      },3000)
    } catch (error) {
      setTimeout(() => {
        this.clearSearch();
      }, 1000);
       this.isValid =!this.isValid;
       this.isError = !this.isError;
    }
  }
goBack(){
  this.router.navigateByUrl('/report')
}
  saveMetadata() {
    this.validateMetadata();
    console.log('on save metadata');
  }
}
