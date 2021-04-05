import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import DownloadingModule from 'highcharts/modules/export-data.js';
HC_exporting(Highcharts);
DownloadingModule(Highcharts);

import { getChartObject } from '../../helpers/get-char-object';

@Component({
  selector: 'app-dashboard-chart',
  templateUrl: './dashboard-chart.component.html',
  styleUrls: ['./dashboard-chart.component.css'],
})
export class DashboardChartComponent implements OnInit {
  @Input() analytics: any;

  constructor() {}

  ngOnInit(): void {
    setTimeout(() => {
      this.updateChart();
    }, 10);
  }

  updateChart() {
    const chartObject: any = getChartObject(this.analytics);
    Highcharts.chart(chartObject);
  }
}
