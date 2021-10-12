import { Component, OnChanges, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ReportModelInterface } from 'src/app/shared/models/report-model-interface';
import { Report } from 'src/app/shared/models/report.model';
import { DeleteCustomReport, EditCustomReport, LoadCustomReport } from 'src/app/store/actions/custom-report.actions';
import { State } from 'src/app/store/reducers';
import { getCustomReportLoadingStatus, getCustomReports } from 'src/app/store/selectors/custom-report.selector';
import { getFilteredReportByUserImplementingPartner } from '../../helpers/report-by-implementing-partner';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-custom-report-table',
  templateUrl: './custom-report-table.component.html',
  styleUrls: ['./custom-report-table.component.css'],
})
export class CustomReportTableComponent implements OnInit{
  reports$:Observable< Report[]>;
  isLoading$: Observable<boolean>;

  constructor(private configService: ConfigService, private router: Router,private store:Store<State>) {
    this.configService.userAccess();
  }

  ngOnInit(): void {
    this.isLoading$ = this.store.select(getCustomReportLoadingStatus);
  this.store.dispatch(LoadCustomReport())
    this.reports$ = this.store.select(getCustomReports);
  }


  onEdit(report: Report) {
    this.router.navigate(['/validator-report', report.id]);
  }

  async onDelete(report: Report){
 this.store.dispatch(DeleteCustomReport({report}))

  }
}
