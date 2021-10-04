import { Component, OnChanges, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ReportModelInterface } from 'src/app/shared/models/report-model-interface';
import { Report } from 'src/app/shared/models/report.model';
import { getFilteredReportByUserImplementingPartner } from '../../helpers/report-by-implementing-partner';
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

  constructor( private configService: ConfigService,private router:Router
    ) { 
 this.configService.userAccess()

    }

  ngOnInit(): void {
    this.fetchCustomReportConfig()
  }

  ngOnChanges(): void { 
  }
  
async fetchCustomReportConfig(){
  this.isLoading = true;
  const implementingPartnerId =
  (await this.configService.getUserImpelementingPartner()) as string
setTimeout(async()=>{
  (await this.configService.getCustomReportConfigs()).subscribe((data)=>{
    this.reports = getFilteredReportByUserImplementingPartner( [...data['reports']] ,implementingPartnerId)
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
