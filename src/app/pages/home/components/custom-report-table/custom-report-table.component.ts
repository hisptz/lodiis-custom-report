import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Report } from 'src/app/shared/models/report.model';
import { State } from 'src/app/store/reducers';
import {
  getCustomReportLoadingStatus,
  getIsRefreshingStatus,
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
  isRefreshing$: Observable<boolean>;

  constructor(private dialogRef: MatDialog, private store: Store<State>) {}

  ngOnInit(): void {
    this.isLoading$ = this.store.select(getCustomReportLoadingStatus);
    this.reports$ = this.store.select(getCustomReports);
    this.isRefreshing$ = this.store.select(getIsRefreshingStatus);
  }

  onEdit(report: Report) {
    const width = '670px';
    const height = '600px';
    this.dialogRef.open(CustomReporFormComponent, {
      height,
      width,
      data: {
        params: report.id,
      },
    });
  }

  onConfirmDeleteAction(report: Report) {
    const width = '500px';
    const height = '300px';
    this.dialogRef.open(CustomReporActionComponent, {
      height,
      width,
      data: {
        reports: report,
      },
    });
  }
}
