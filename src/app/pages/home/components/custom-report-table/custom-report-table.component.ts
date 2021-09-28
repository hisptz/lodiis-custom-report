import { Component, OnInit } from '@angular/core';
import { ReportModelInterface } from 'src/app/shared/models/report-model-interface';

@Component({
  selector: 'app-custom-report-table',
  templateUrl: './custom-report-table.component.html',
  styleUrls: ['./custom-report-table.component.css']
})
export class CustomReportTableComponent implements OnInit {

  reportList: ReportModelInterface[] = [
    {
      id: 1,
      name: 'OVC Layering Dataset (Services)',
    },
    {
      id: 2,
      name: 'DREAMS Layering Dataset (Services)',
    },
    {
      id: 3,
      name: 'PSI DREAMS Layering Dataset (Enrollment & Services)',
    },
    {
      id: 4,
      name: 'KB DREAMS Layering Dataset (Services)',
    },
    {
      id: 5,
      name: 'DREAMS Layering Dataset (Referral)',
    },
    {
      id: 6,
      name: 'DREAMS Layering Dataset (Service and Referral)',
    },
    {
      id: 7,
      name: 'Cumulative DREAMS Layering Dataset',
    },

  ];
  constructor() { }

  ngOnInit(): void {
  }

  onEdit(report:ReportModelInterface){

  }

}
