import { Component, Input, OnInit } from '@angular/core';
import { Report } from 'src/app/shared/models/report.model';

@Component({
  selector: 'app-current-selection',
  templateUrl: './current-selection.component.html',
  styleUrls: ['./current-selection.component.css'],
})
export class CurrentSelectionComponent implements OnInit {
  @Input() selectedPeriods: Array<any>;
  @Input() selectedOrgUnitItems: Array<any>;
  @Input() selectedReport: Report;
  @Input() reportHasPeriod: boolean;
  @Input() reportHasLocation: boolean;
  constructor() {}

  ngOnInit(): void {
    this.reportHasPeriod = false;
  }
  getReportParameterSelectionStatus() {
    return (
      this.selectedReport ||
      (this.selectedPeriods && this.selectedPeriods.length > 0) ||
      (this.selectedOrgUnitItems && this.selectedOrgUnitItems.length > 0)
    );
  }
}
