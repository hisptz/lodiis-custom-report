import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report-download',
  templateUrl: './report-download.component.html',
  styleUrls: ['./report-download.component.css'],
})
export class ReportDownloadComponent implements OnInit {
  report = {
    id: 'cumulative_DREAMS_Layering',
    reportName: 'cumulative_DREAMS_Layering.xlsx',
    path: 'assets/reports/cumulative_DREAMS_Layering.xlsx',
    created: '2021-04-29T12:51:35.599Z',
  };
  constructor() {}

  ngOnInit(): void {}
}
