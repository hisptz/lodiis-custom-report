import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PeSelectionComponent } from '../../components/pe-selection/pe-selection.component';
import { OuSelectionComponent } from '../../components/ou-selection/ou-selection.component';
import {
  getDefaultOrganisationUnitSelections,
} from '../../helpers/get-dashboard-chart-selections';

import { Store } from '@ngrx/store';
import { State } from 'src/app/store/reducers';
import { loadDashboardData } from 'src/app/store/actions';
import { Observable } from 'rxjs';
import { getAnlyticsParameters } from '../../helpers/get-anlytics-parameters';
import {
  getCurrentAnalyticsLoadingStatus,
  getCurrentAnalytics,
  getCurrentAnalyticsError,
} from 'src/app/store/selectors/dashboard-data.selectors';
import { getCurrentUserOrganisationUnits } from 'src/app/store/selectors';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  selectedPeriods: Array<any>;
  selectedOrgUnitItems: Array<any>;
  isLoading$: Observable<boolean>;
  analytics$: Observable<any>;
  analyticsError$: Observable<any>;

  constructor(private dialog: MatDialog, private store: Store<State>) {}

  ngOnInit() {
    this.isLoading$ = this.store.select(getCurrentAnalyticsLoadingStatus);
    this.analytics$ = this.store.select(getCurrentAnalytics);
    this.analyticsError$ = this.store.select(getCurrentAnalyticsError);
    this.selectedPeriods =  [];// getDefaultPeriodSelections();
    this.store
      .select(getCurrentUserOrganisationUnits)
      .subscribe((userOrgnisationUnits) => {
        if (
          !this.selectedOrgUnitItems &&
          userOrgnisationUnits &&
          userOrgnisationUnits.length > 0
        ) {
          this.selectedOrgUnitItems = getDefaultOrganisationUnitSelections(
            userOrgnisationUnits
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

  getReportParameterSelectionStatus(){
    return this.selectedOrgUnitItems  && this.selectedPeriods &&this.selectedPeriods.length > 0 && this.selectedOrgUnitItems.length > 0 ;
  }

  onGenerateReport() {
    const isAllParameterSelected = this.getReportParameterSelectionStatus();
    if(isAllParameterSelected ){
      const report = {
        "id": "",
        "name": "",
        "program": "hOEIHJDrrvz",
        "dxConfig": [
          {
            "programStage": "QNdBI9U7rnV",
            "name": "First Name",
            "id": "WTZ7GLTrE8Q"
          },{
            "programStage": "kq6qeEgbDVY",
            "name": "Middle Name",
            "id": "s1HaiT6OllL"
          },{
            "programStage": "NXsIkG9Q1BA",
            "name": "Contraceptive_P",
            "id": "uciT2F6ByYO"
          }
        ]
      };
  
      console.log({report, selectedPeriods : this.selectedPeriods, selectedOrgUnitItems:this.selectedOrgUnitItems});
    }
    
  }

  onDownloadReport() {
    const isAllParameterSelected = this.getReportParameterSelectionStatus();
    if(isAllParameterSelected ){
      const report = {
        "id": "",
        "name": "",
        "program": "hOEIHJDrrvz",
        "dxConfig": [
          {
            "programStage": "QNdBI9U7rnV",
            "name": "First Name",
            "id": "WTZ7GLTrE8Q"
          },{
            "programStage": "kq6qeEgbDVY",
            "name": "Middle Name",
            "id": "s1HaiT6OllL"
          },{
            "programStage": "NXsIkG9Q1BA",
            "name": "Contraceptive_P",
            "id": "uciT2F6ByYO"
          }
        ]
      };
  
      console.log({report, selectedPeriods : this.selectedPeriods, selectedOrgUnitItems:this.selectedOrgUnitItems});
    }
  }

  updateChart() {
    const { pe, dx, ou } = getAnlyticsParameters(
      this.selectedOrgUnitItems,
      this.selectedPeriods
    );
    this.store.dispatch(loadDashboardData({ pe, dx, ou }));
  }
}
