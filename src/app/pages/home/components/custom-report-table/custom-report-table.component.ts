import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Report } from 'src/app/shared/models/report.model';
import { State } from 'src/app/store/reducers';
import {
  getCustomReportLoadingStatus,
  getCustomReports,
} from 'src/app/store/selectors/custom-report.selector';
import { CustomReporFormComponent } from '../custom-report-form/custom-report-form.component';
import { MatDialog } from '@angular/material/dialog';
import { CustomReporActionComponent } from '../custom-report-action/custom-report-action.component';

@Component({
  selector: 'app-custom-report-table',
  templateUrl: './custom-report-table.component.html',
  styleUrls: ['./custom-report-table.component.css'],
})
export class CustomReportTableComponent implements OnInit {
  reports$: Observable<Report[]>;
  isLoading$: Observable<boolean>;

  constructor(private dialogRef: MatDialog, private store: Store<State>) {}

  ngOnInit(): void {
    this.isLoading$ = this.store.select(getCustomReportLoadingStatus);
    this.reports$ = this.store.select(getCustomReports);
  }

  onEdit(report: Report) {
    this.dialogRef.open(CustomReporFormComponent, {
      height: '90%',
      width: '100%',
      data: {
        params: report.id,
      },
    });
  }

  onConfirmDeleteAction(report: Report) {
    this.dialogRef.open(CustomReporActionComponent, {
      height: '20%',
      width: '50%',
      data: {
        reports: report,
      },
    });
  }
}
