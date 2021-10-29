import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CustomReporFormComponent } from '../../components/custom-report-form/custom-report-form.component';

@Component({
  selector: 'app-custom-report-list',
  templateUrl: './custom-report-list.component.html',
  styleUrls: ['./custom-report-list.component.css'],
})
export class CustomReportListComponent {
  constructor(private router: Router, private dialogRef: MatDialog) {}

  goBack() {
    this.router.navigateByUrl('');
  }

  onAddReport() {
    const width = '800px';
    const height = '600px';
    this.dialogRef.open(CustomReporFormComponent, {
      height,
      width,
      data: {
        params: 'true',
      },
    });
  }
}
