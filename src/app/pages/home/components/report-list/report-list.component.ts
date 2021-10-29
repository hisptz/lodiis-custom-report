import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MetadataValidatorComponent } from '../metadata-validator/metadata-validator.component';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.css'],
})
export class ReportListComponent {
  constructor(private router: Router, private dialogRef: MatDialog) {}

  goBack() {
    this.router.navigateByUrl('');
  }

  onAddReport() {
    this.dialogRef.open(MetadataValidatorComponent, {
      height: '90%',
      width: '100%',
      data: {
        params: 'true',
      },
    });
  }
}
