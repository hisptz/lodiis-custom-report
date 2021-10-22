import { Component, OnChanges, OnInit, ViewChild } from '@angular/core';
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
import { MetadataValidatorComponent } from '../metadata-validator/metadata-validator.component';
import { MatDialog } from  '@angular/material/dialog';
import { ReportactionComponent } from '../reportaction/reportaction.component';
import {MatMenuModule} from '@angular/material/menu';


@Component({
  selector: 'app-custom-report-table',
  templateUrl: './custom-report-table.component.html',
  styleUrls: ['./custom-report-table.component.css'],
})
export class CustomReportTableComponent implements OnInit{
  reports$:Observable< Report[]>;
  isLoading$: Observable<boolean>;

  constructor(private  dialogRef : MatDialog,private configService: ConfigService, private router: Router,private store:Store<State>){}

  ngOnInit(): void {
    this.isLoading$ = this.store.select(getCustomReportLoadingStatus);
    this.reports$ = this.store.select(getCustomReports);
    const matMenu = MatMenuModule;
  }

  onEdit(report: Report) {
    this.dialogRef.open(MetadataValidatorComponent,{
      height:'90%',
      width:'100%',
      data:{
        params:report.id
      }
    });
  }


  onConfirmDeleteAction(report: Report) {
    this.dialogRef.open(ReportactionComponent,{
      height:'20%',
      width:'50%',
      data:{
        reports:report
      }
    });
  }


  }






