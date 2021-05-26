import { Component, OnInit } from '@angular/core';
import { ErrorMessage } from '@iapps/ngx-dhis2-http-client';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { State } from 'src/app/store/reducers';
import { getCurrentAnalyticsError } from 'src/app/store/selectors/report-data.selectors';

@Component({
  selector: 'app-report-error',
  templateUrl: './report-error.component.html',
  styleUrls: ['./report-error.component.css'],
})
export class ReportErrorComponent implements OnInit {
  reportErrors$: Observable<ErrorMessage>;
  constructor(private store: Store<State>) {}

  ngOnInit(): void {
    this.reportErrors$ = this.store.select(getCurrentAnalyticsError);
  }
}
