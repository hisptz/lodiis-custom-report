import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from  '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
interface actionModel {
  name:string;
  icon:any
 }
@Component({
  selector: 'app-reportaction',
  templateUrl: './reportaction.component.html',
  styleUrls: ['./reportaction.component.css']
})

export class ReportactionComponent implements OnInit {
 actionsValues:actionModel[] = []
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {params: string}) { }

  ngOnInit(): void {
  }

}
