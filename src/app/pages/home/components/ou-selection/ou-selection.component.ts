import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrgUnitFilterConfig } from '@iapps/ngx-dhis2-org-unit-filter';

@Component({
  selector: 'app-ou-selection',
  templateUrl: './ou-selection.component.html',
  styleUrls: ['./ou-selection.component.css'],
})
export class OuSelectionComponent implements OnInit {
  orgUnitFilterConfig: OrgUnitFilterConfig;
  selectedOrgUnitItems = [];

  constructor(
    private dialogRef: MatDialogRef<OuSelectionComponent>,
    @Inject(MAT_DIALOG_DATA) public selectionDialogData: any
  ) {}

  ngOnInit(): void {
    this.orgUnitFilterConfig = {
      singleSelection: false,
      showUserOrgUnitSection: false,
      showOrgUnitLevelGroupSection: false,
      showOrgUnitGroupSection: false,
      showOrgUnitLevelSection: true,
      reportUse: false,
      batchSize: 400,
      hideActionButtons: false,
      contentHeight: '400px',
      emitOnSelection: false,
    };
  }

  onFilterUpdate(selectedOrgUnitItems, action: string) {
    this.dialogRef.close({
      selectedOrgUnitItems,
      action,
    });
  }
}
