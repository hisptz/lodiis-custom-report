import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { PeSelectionComponent } from '../../components/pe-selection/pe-selection.component';
import { OuSelectionComponent } from '../../components/ou-selection/ou-selection.component';
import { getDefaultOrganisationUnitSelections } from '../../helpers/get-dafault-selections';
import { State } from 'src/app/store/reducers';
import { ClearReportData, LoadReportData } from 'src/app/store/actions';
import { getAnalyticsParameters } from '../../helpers/get-analytics-parameters';
import {
  getCurrentAnalyticsLoadingStatus,
  getCurrentAnalytics,
  getCurrentAnalyticsError,
} from 'src/app/store/selectors/report-data.selectors';
import {
  getCurrentUserAccessToReportConfiguration,
  getCurrentUserOrganisationUnits,
  getSelectedGeneratedReport,
  isCurrentUserHasCountryLevelOrganisationUnit,
} from 'src/app/store/selectors';
import * as reportConfig from '../../../../core/config/report.config.json';
import { Report } from 'src/app/shared/models/report.model';
import { ExcelFileService } from 'src/app/core/services/excel-file.service';
import { take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GeneratedReport } from 'src/app/shared/models/generated-report.model';
import { ConfigService } from '../../services/config.service';
import { Router } from '@angular/router';
import { getFilteredReportByUserImplementingPartner } from '../../helpers/report-by-implementing-partner';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  selectedPeriods: Array<any>;
  disablePeriodSelection: boolean;
  disableOrgUnitSelection: boolean;
  selectedOrgUnitItems: Array<any>;
  programMetadataObjects: any;
  selectedReport: Report;
  reports: Array<Report>;
  customReports: Array<Report>;
  isLoading$: Observable<boolean>;
  downloading: boolean;
  isConfigAccessAllow$: Observable<boolean>;
  analytics$: Observable<any>;
  analyticsError$: Observable<any>;
  generatedReport$: Observable<GeneratedReport>;
  hasCountryLevelOrganisationUnit$: Observable<boolean>;

  constructor(
    private dialog: MatDialog,
    private store: Store<State>,
    private excelFileService: ExcelFileService,
    private snackbar: MatSnackBar,
    private router: Router,
    private configService: ConfigService
  ) {}

  ngOnInit() {
    this.hasCountryLevelOrganisationUnit$ = this.store.select(
      isCurrentUserHasCountryLevelOrganisationUnit
    );
    this.isLoading$ = this.store.select(getCurrentAnalyticsLoadingStatus);
    this.analytics$ = this.store.select(getCurrentAnalytics);
    this.analyticsError$ = this.store.select(getCurrentAnalyticsError);
    this.downloading = false;
    this.isConfigAccessAllow$ = this.store.select(
      getCurrentUserAccessToReportConfiguration
    );

    this.selectedPeriods = [
      {
        id: '202112',
        type: 'Monthly',
        name: 'December 2021',
      },
      {
        id: '202201',
        type: 'Monthly',
        name: 'January 2022',
      },
    ];
    this.programMetadataObjects = {};
    this.fetchReportConfig();
    this.store
      .select(getCurrentUserOrganisationUnits)
      .pipe(take(1))
      .subscribe((userOrganisationUnits) => {
        if (userOrganisationUnits && userOrganisationUnits.length > 0) {
          this.selectedOrgUnitItems = getDefaultOrganisationUnitSelections(
            userOrganisationUnits
          );
        }
      });
  }
  goReportList() {
    this.router.navigate(['/report']);
  }
  async fetchReportConfig() {
    const implementingPartnerId =
      (await this.configService.getUserImpelementingPartner()) as string;
    this.configService
      .getReportConfigs()
      .pipe(take(1))
      .subscribe(
        (configs: any) => {
          this.configService
            .getCustomReportConfigs()
            .pipe(take(1))
            .subscribe((customConfig: any) => {
              const reports =
                [...configs.reports, ...customConfig.reports] ||
                reportConfig.reports ||
                [];

              const reportsByCurrentIp =
                getFilteredReportByUserImplementingPartner(
                  reports,
                  implementingPartnerId
                );
              const selectedProgramIds = _.uniq(
                _.flattenDeep(
                  _.map(
                    reportsByCurrentIp,
                    (report: Report) => report.program || []
                  )
                )
              );
              this.setProgramMetadata(selectedProgramIds);
              this.reports = reportsByCurrentIp;
            });
        },
        () => {
          const reports = reportConfig.reports || ([] as Array<any>);
          const reportsByCurrentIp = getFilteredReportByUserImplementingPartner(
            reports,
            implementingPartnerId
          );
          const selectedProgramIds = _.uniq(
            _.flattenDeep(
              _.map(
                reportsByCurrentIp,
                (report: Report) => report.program || []
              )
            )
          );
          this.setProgramMetadata(selectedProgramIds);
          this.reports = reportsByCurrentIp;
        }
      );
  }

  async setProgramMetadata(programIds: String[] = []) {
    this.programMetadataObjects =
      await this.configService.getExtendeReportMetadata(programIds);
  }

  getSanitizedListOfReport(hasCountryLevelOrganisationUnit: boolean) {
    return hasCountryLevelOrganisationUnit
      ? this.reports
      : _.filter(
          this.reports,
          (report: Report) =>
            !(report.disableOrgUnitSelection && report.disablePeriodSelection)
        );
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
    const report: Report = _.find(
      this.reports || [],
      (reportObject) => reportObject.id === e.value
    );
    if (report) {
      this.selectedReport = report;
      this.disablePeriodSelection = report.disablePeriodSelection ?? false;
      this.disableOrgUnitSelection = report.disableOrgUnitSelection ?? false;
    }

    if (this.disableOrgUnitSelection && this.disablePeriodSelection) {
      this.store.dispatch(ClearReportData());
      this.generatedReport$ = this.store.select(
        getSelectedGeneratedReport(report.id ?? '')
      );
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
    if (this.selectedReport && !this.selectedReport.disablePeriodSelection) {
      const includeEnrollmentWithoutService =
        this.selectedReport.includeEnrollmentWithoutService || false;
      const selectedProgramIds = includeEnrollmentWithoutService
        ? _.flattenDeep([this.selectedReport.program])
        : [];
      const analyticParameters = getAnalyticsParameters(
        this.selectedOrgUnitItems,
        this.selectedPeriods,
        selectedProgramIds,
        this.programMetadataObjects,
        this.selectedReport.dxConfigs
      );
      this.store.dispatch(
        LoadReportData({
          analyticParameters,
          reportConfig: this.selectedReport,
        })
      );
    }
  }

  onDownloadReport() {
    this.downloading = true;
    this.presentSnackBar('Downloading report', 'OK');
    this.analytics$.pipe(take(1)).subscribe((data) => {
      const date = new Date();
      const reportName = `${this.selectedReport.name}_${
        date.toISOString().split('T')[0]
      }`;
      let skipHeader = false;
      const removedColumns: string[] = [
        'First Name',
        'Surname',
        'Contact Numbers',
      ];

      if (data.length > 0) {
        const sanitizedData: any[] = data.map((singleData: any) => {
          return _.omit(singleData, removedColumns);
        });
        const reportSummary = [];
        const headers = _.uniq(
          _.flattenDeep(_.map(_.keys(_.head(sanitizedData))))
        );
        if (headers.length > 0) {
          skipHeader = true;
          const selectedLocation = _.map(
            this.selectedOrgUnitItems,
            (item: any) => item.name || ''
          ).join(', ');
          const selectedPeriod = _.map(
            this.selectedPeriods,
            (item: any) => item.name || ''
          ).join(', ');
          const defaultHeader = _.head(headers);
          const selectedLocationJsonData = {};
          const selectedPeriodJsonData = {};
          selectedLocationJsonData[
            defaultHeader
          ] = `Location : ${selectedLocation}`;
          selectedPeriodJsonData[defaultHeader] = `Period : ${selectedPeriod}`;
          reportSummary.push(selectedLocationJsonData);
          reportSummary.push(selectedPeriodJsonData);
          reportSummary.push({});
          const headerJson = {};
          for (const header of headers) {
            headerJson[header] = header;
          }
          reportSummary.push(headerJson);
        }
        this.excelFileService.writeToSingleSheetExcelFile(
          [...reportSummary, ...sanitizedData],
          reportName,
          skipHeader
        );
        this.downloading = false;
      }
    });
  }

  presentSnackBar(message: string, action = '') {
    this.snackbar.open(message, _.upperCase(action), {
      duration: 1000,
    });
  }
}
