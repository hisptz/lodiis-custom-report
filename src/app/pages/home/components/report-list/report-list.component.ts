import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.css'],
})
export class ReportListComponent {
  isReadOnly = true;
  isEdit = false;

  

  constructor( private router: Router) {}

  goBack() {
    this.router.navigateByUrl('')  }

  onAddReport() {
    this.router.navigate(['/validator-report']);
  }
  onSave() {
    console.log('on save');
    this.isEdit = !this.isEdit;
  }

  onEdit() {
    console.log('edit');
    this.isReadOnly = !this.isReadOnly;
    this.isEdit = !this.isEdit;
  }
  getStyles() {
    if (this.isEdit) {
      return {
        // 'color': 'black',
        // 'outline': 'none',
        // 'border-radius': '12px',
        // 'padding': '4px 8px'
      };
    } else {
      return {
        padding: '4px 8px',
        'border-radius': 'none',
        border: 'none',
      };
    }
  }
  getStyle() {
    if (this.isEdit) {
      return {
        // color: 'black',
        // outline: 'none',
        // 'border-radius': '12px',
        // width: '50%',
        // ' height': '30px',
        // border: '1px solid',
        // 'margin-top': '20px',
        // 'padding-right': '10px',
        // 'padding-bottom': '30px',
      };
    }
  }
}
