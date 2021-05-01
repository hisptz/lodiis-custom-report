import { Component, Input, OnInit } from '@angular/core';
import { GeneratedReport } from 'src/app/shared/models/generated-report.model';
import { Report } from 'src/app/shared/models/report.model';

@Component({
  selector: 'app-report-download',
  templateUrl: './report-download.component.html',
  styleUrls: ['./report-download.component.css'],
})
export class ReportDownloadComponent implements OnInit {
  @Input() selectedReport: Report;
  @Input() generatedReport: GeneratedReport;
  constructor() {}

  ngOnInit(): void {}
}
