import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ErrorMessage } from '@iapps/ngx-dhis2-http-client';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { State } from 'src/app/store/reducers';
import {
  getCurrentAnalytics,
  getCurrentAnalyticsError,
  getCurrentAnalyticsLoadingStatus,
} from 'src/app/store/selectors/report-data.selectors';

@Component({
  selector: 'app-report-view',
  templateUrl: './report-view.component.html',
  styleUrls: ['./report-view.component.css'],
})
export class ReportViewComponent implements OnInit, AfterViewInit {
  currentAnalytics$: Observable<any>;
  currentAnalyticsError$: Observable<ErrorMessage>;
  currentAnalyticsLoading$: Observable<boolean>;

  constructor(private store: Store<State>, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.currentAnalyticsError$ = this.store.select(getCurrentAnalyticsError);
    this.currentAnalyticsLoading$ = this.store.select(
      getCurrentAnalyticsLoadingStatus
    );
    this.currentAnalytics$ = this.store.select(getCurrentAnalytics);
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }
}
