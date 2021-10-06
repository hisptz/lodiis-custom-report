import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.css'],
})
export class ReportListComponent {

  constructor( private router: Router) {}

  goBack() {
    this.router.navigateByUrl('')  }

  onAddReport() {
    this.router.navigate(['/validator-report','true']);
  }


}
