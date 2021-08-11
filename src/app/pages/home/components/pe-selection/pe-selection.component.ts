import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PeriodFilterConfig } from 'src/app/ngx-dhis2-period-filter/models/period-filter-config.model';

@Component({
  selector: 'app-pe-selection',
  templateUrl: './pe-selection.component.html',
  styleUrls: ['./pe-selection.component.css'],
})
export class PeSelectionComponent implements OnInit {
  periodFilterConfig: PeriodFilterConfig;
  selectedPeriods = [];
  defaultPeriodTypes: string[];

  constructor(
    private dialogRef: MatDialogRef<PeSelectionComponent>,
    @Inject(MAT_DIALOG_DATA) public selectionDialogData: any
  ) {}

  //@TODO allowing date range
  ngOnInit(): void {
    this.periodFilterConfig = {
      singleSelection: false,
      emitOnSelection: false,
      allowDateRangeSelection: false,
      allowRelativePeriodSelection: true,
      allowFixedPeriodSelection: true,
      contentHeight: '400px',
    };
  }

  onFilterUpdate(selectedPeriods, action: string) {
    this.dialogRef.close({
      selectedPeriods,
      action,
    });
  }
}
