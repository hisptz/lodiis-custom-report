import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

import { PeSelectionComponent } from '../../components/pe-selection/pe-selection.component';
import { OuSelectionComponent } from '../../components/ou-selection/ou-selection.component';
import { getDefaultOrganisationUnitSelections } from '../../helpers/get-dafault-selections';
import { State } from 'src/app/store/reducers';
import { LoadReportData } from 'src/app/store/actions';
import { getAnalyticsParameters } from '../../helpers/get-anlytics-parameters';
import {
  getCurrentAnalyticsLoadingStatus,
  getCurrentAnalytics,
  getCurrentAnalyticsError,
} from 'src/app/store/selectors/report-data.selectors';
import { getCurrentUserOrganisationUnits } from 'src/app/store/selectors';
import * as reportConfig from '../../../../core/config/report.config.json';
import { Report } from 'src/app/shared/models/report.model';
import { ExcelFileService } from 'src/app/core/services/excel-file.service';
import { take } from 'rxjs/operators';
import { ReportErrorComponent } from '../../components/report-error/report-error.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  selectedPeriods: Array<any>;
  disablePeriodSelection: boolean;
  selectedOrgUnitItems: Array<any>;
  selectedReport: Report;
  reports: Array<Report>;
  isLoading$: Observable<boolean>;
  analytics$: Observable<any>;
  analyticsError$: Observable<any>;

  constructor(
    private dialog: MatDialog,
    private store: Store<State>,
    private excelFileService: ExcelFileService
  ) {}

  ngOnInit() {
    this.isLoading$ = this.store.select(getCurrentAnalyticsLoadingStatus);
    this.analytics$ = this.store.select(getCurrentAnalytics);
    this.analyticsError$ = this.store.select(getCurrentAnalyticsError);
    this.selectedPeriods = [];
    this.reports = reportConfig.report || [];
    this.store
      .select(getCurrentUserOrganisationUnits)
      .subscribe((userOrganisationUnits) => {
        if (
          !this.selectedOrgUnitItems &&
          userOrganisationUnits &&
          userOrganisationUnits.length > 0
        ) {
          this.selectedOrgUnitItems = getDefaultOrganisationUnitSelections(
            userOrganisationUnits
          );
        }
      });
  }

  openOrganisationUnitFilter() {
    const width = '800px';
    const height = '700px';
    const selectionDialog = this.dialog.open(OuSelectionComponent, {
      width,
      height,
      data: {
        selectedOrgUnitItems: this.selectedOrgUnitItems,
      },
    });
    selectionDialog.afterClosed().subscribe((dialogData: any) => {
      if (dialogData && dialogData.action) {
        this.selectedOrgUnitItems =
          dialogData.selectedOrgUnitItems.items || this.selectedOrgUnitItems;
      }
    });
  }

  openPeriodFilter() {
    const width = '800px';
    const height = '600px';
    const selectionDialog = this.dialog.open(PeSelectionComponent, {
      width,
      height,
      data: {
        selectedPeriods: this.selectedPeriods,
      },
    });
    selectionDialog.afterClosed().subscribe((dialogData: any) => {
      if (dialogData && dialogData.action && dialogData.action === 'UPDATE') {
        this.selectedPeriods =
          dialogData.selectedPeriods.items || this.selectedPeriods;
      }
    });
  }

  onSelectReport(e) {
    const report = _.find(
      this.reports || [],
      (reportObject) => reportObject.id === e.value
    );
    if (report) {
      this.selectedReport = report;
      this.disablePeriodSelection = report.disablePeriodSelection ?? false;
    }
  }

  getReportParameterSelectionStatus() {
    return (
      this.selectedOrgUnitItems &&
      this.selectedReport &&
      (this.disablePeriodSelection ||
        (this.selectedPeriods && this.selectedPeriods.length > 0)) &&
      this.selectedOrgUnitItems.length > 0
    );
  }

  onGenerateReport() {
    const analyticParameters = getAnalyticsParameters(
      this.selectedOrgUnitItems,
      this.selectedPeriods,
      this.selectedReport.dxConfigs
    );
    this.store.dispatch(
      LoadReportData({ analyticParameters, reportConfig: this.selectedReport })
    );
  }

  onDownloadReport() {
    this.analytics$.pipe(take(1)).subscribe((data) => {
      const date = new Date();
      const reportName = `${this.selectedReport.name}_${
        date.toISOString().split('T')[0]
      }`;
      this.excelFileService.writeToSingleSheetExcelFile(data, reportName);
    });
  }

  onViewErrors() {
    const width = '800px';
    const selectionDialog = this.dialog.open(ReportErrorComponent, {
      width,
      height: 'auto',
    });
  }
}
