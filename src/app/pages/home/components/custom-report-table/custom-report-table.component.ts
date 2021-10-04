import { Component, OnChanges, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ReportModelInterface } from 'src/app/shared/models/report-model-interface';
import { Report } from 'src/app/shared/models/report.model';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-custom-report-table',
  templateUrl: './custom-report-table.component.html',
  styleUrls: ['./custom-report-table.component.css']
})
export class CustomReportTableComponent implements OnInit ,OnChanges{
  reports:Report[];
  isEdit:boolean = false;
  isLoading:boolean = true;

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
  constructor( private configService: ConfigService,private router:Router
    ) { }

  ngOnInit(): void {
    this.fetchCustomReportConfig()
  }

  ngOnChanges(): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.

 
  }
  
 fetchCustomReportConfig(){
  this.isLoading = true;
setTimeout(async()=>{
  (await this.configService.getCustomReportConfigs()).subscribe((data)=>{
    this.reports = [...data['reports']] 
   //  ? this.reportList
  })
  this.isLoading =false;
},1000)
}

onEdit(report:Report){
  this.isEdit = !this.isEdit;
this.configService.sendEditReport(report);
this.router.navigate(['/report', report.id]);
}


}
