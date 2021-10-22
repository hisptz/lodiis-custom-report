import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from  '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Report } from 'src/app/shared/models/report.model';
import { DeleteCustomReport } from 'src/app/store/actions/custom-report.actions';
import { State } from 'src/app/store/reducers';

@Component({
  selector: 'app-reportaction',
  templateUrl: './reportaction.component.html',
  styleUrls: ['./reportaction.component.css']
})

export class ReportactionComponent implements OnInit {
 deleteAction:boolean = false;
 reportTitle:string ='';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {reports: Report},public dialog: MatDialog,private store:Store<State>,private router:Router) { }

  ngOnInit(): void {
    this.reportTitle = this.data.reports.name;
  }

    onComfirmAction(actionComfirm:boolean){
      if(actionComfirm){
        let report =this.data.reports;
return this.store.dispatch(DeleteCustomReport({report}));
      }else{
        // return this.router.navigateByUrl('');
        this.dialog.closeAll()
      }

    } 

}
